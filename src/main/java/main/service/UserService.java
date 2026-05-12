package main.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import main.config.Constants;
import main.domain.Authority;
import main.domain.ProfiloRistoratore;
import main.domain.User;
import main.domain.enumeration.LivelloUtente;
import main.repository.AuthorityRepository;
import main.repository.PersistentTokenRepository;
import main.repository.ProfiloRistoratoreRepository;
import main.repository.UserRepository;
import main.security.AuthoritiesConstants;
import main.security.SecurityUtils;
import main.service.dto.AdminUserDTO;
import main.service.dto.UserDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.CacheManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.security.RandomUtil;

/**
 * Service class for managing users.
 *
 * Percorso: src/main/java/main/service/UserService.java
 * → SOSTITUISCE il file generato da JHipster
 * → Modifica: registerUser() crea automaticamente un ProfiloRistoratore
 *   con LIVELLO_1 dopo la registrazione.
 */
@Service
@Transactional
public class UserService {

    private static final Logger LOG = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PersistentTokenRepository persistentTokenRepository;
    private final AuthorityRepository authorityRepository;
    private final CacheManager cacheManager;
    private final ProfiloRistoratoreRepository profiloRistoratoreRepository;

    public UserService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        PersistentTokenRepository persistentTokenRepository,
        AuthorityRepository authorityRepository,
        CacheManager cacheManager,
        ProfiloRistoratoreRepository profiloRistoratoreRepository
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.persistentTokenRepository = persistentTokenRepository;
        this.authorityRepository = authorityRepository;
        this.cacheManager = cacheManager;
        this.profiloRistoratoreRepository = profiloRistoratoreRepository;
    }

    public Optional<User> activateRegistration(String key) {
        LOG.debug("Activating user for activation key {}", key);
        return userRepository
            .findOneByActivationKey(key)
            .map(user -> {
                user.setActivated(true);
                user.setActivationKey(null);
                this.clearUserCaches(user);
                LOG.debug("Activated user: {}", user);
                return user;
            });
    }

    public Optional<User> completePasswordReset(String newPassword, String key) {
        LOG.debug("Reset user password for reset key {}", key);
        return userRepository
            .findOneByResetKey(key)
            .filter(user -> user.getResetDate().isAfter(Instant.now().minus(1, ChronoUnit.DAYS)))
            .map(user -> {
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setResetKey(null);
                user.setResetDate(null);
                this.clearUserCaches(user);
                return user;
            });
    }

    public Optional<User> requestPasswordReset(String mail) {
        return userRepository
            .findOneByEmailIgnoreCase(mail)
            .filter(User::isActivated)
            .map(user -> {
                user.setResetKey(RandomUtil.generateResetKey());
                user.setResetDate(Instant.now());
                this.clearUserCaches(user);
                return user;
            });
    }

    /**
     * Registra un nuovo utente.
     *
     * MODIFICA RISPETTO A JHIPSTER:
     * Dopo il salvataggio dell'utente, crea automaticamente un ProfiloRistoratore
     * con livello LIVELLO_1. Il profilo è inattivo finché l'admin non attiva l'account
     * tramite il pannello di amministrazione JHipster standard (campo activated su User).
     */
    public User registerUser(AdminUserDTO userDTO, String password) {
        userRepository
            .findOneByLogin(userDTO.getLogin().toLowerCase())
            .ifPresent(existingUser -> {
                boolean removed = removeNonActivatedUser(existingUser);
                if (!removed) {
                    throw new UsernameAlreadyUsedException();
                }
            });
        userRepository
            .findOneByEmailIgnoreCase(userDTO.getEmail())
            .ifPresent(existingUser -> {
                boolean removed = removeNonActivatedUser(existingUser);
                if (!removed) {
                    throw new EmailAlreadyUsedException();
                }
            });

        User newUser = new User();
        String encryptedPassword = passwordEncoder.encode(password);
        newUser.setLogin(userDTO.getLogin().toLowerCase());
        newUser.setPassword(encryptedPassword);
        newUser.setFirstName(userDTO.getFirstName());
        newUser.setLastName(userDTO.getLastName());
        if (userDTO.getEmail() != null) {
            newUser.setEmail(userDTO.getEmail().toLowerCase());
        }
        newUser.setImageUrl(userDTO.getImageUrl());
        newUser.setLangKey(userDTO.getLangKey());
        newUser.setActivated(false);
        newUser.setActivationKey(RandomUtil.generateActivationKey());
        Set<Authority> authorities = new HashSet<>();
        authorityRepository.findById(AuthoritiesConstants.USER).ifPresent(authorities::add);
        newUser.setAuthorities(authorities);
        User savedUser = userRepository.save(newUser);
        this.clearUserCaches(newUser);
        LOG.debug("Created Information for User: {}", newUser);

        // ── MODIFICA: crea il ProfiloRistoratore con LIVELLO_1 ────────────────
        ProfiloRistoratore profilo = new ProfiloRistoratore();
        profilo.setUser(savedUser);
        profilo.setLivello(LivelloUtente.LIVELLO_1);
        profiloRistoratoreRepository.save(profilo);
        LOG.debug("Creato ProfiloRistoratore con LIVELLO_1 per utente: {}", savedUser.getLogin());
        // ─────────────────────────────────────────────────────────────────────

        return savedUser;
    }

    private boolean removeNonActivatedUser(User existingUser) {
        if (existingUser.isActivated()) return false;
        userRepository.delete(existingUser);
        userRepository.flush();
        this.clearUserCaches(existingUser);
        return true;
    }

    public User createUser(AdminUserDTO userDTO) {
        User user = new User();
        user.setLogin(userDTO.getLogin().toLowerCase());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        if (userDTO.getEmail() != null) {
            user.setEmail(userDTO.getEmail().toLowerCase());
        }
        user.setImageUrl(userDTO.getImageUrl());
        if (userDTO.getLangKey() == null) {
            user.setLangKey(Constants.DEFAULT_LANGUAGE);
        } else {
            user.setLangKey(userDTO.getLangKey());
        }
        String encryptedPassword = passwordEncoder.encode(RandomUtil.generatePassword());
        user.setPassword(encryptedPassword);
        user.setResetKey(RandomUtil.generateResetKey());
        user.setResetDate(Instant.now());
        user.setActivated(true);
        if (userDTO.getAuthorities() != null) {
            Set<Authority> authorities = userDTO
                .getAuthorities()
                .stream()
                .map(authorityRepository::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toSet());
            user.setAuthorities(authorities);
        }
        userRepository.save(user);
        this.clearUserCaches(user);
        LOG.debug("Created Information for User: {}", user);
        return user;
    }

    public Optional<AdminUserDTO> updateUser(AdminUserDTO userDTO) {
        return Optional.of(userRepository.findById(userDTO.getId()))
            .filter(Optional::isPresent)
            .map(Optional::get)
            .map(user -> {
                this.clearUserCaches(user);
                user.setLogin(userDTO.getLogin().toLowerCase());
                user.setFirstName(userDTO.getFirstName());
                user.setLastName(userDTO.getLastName());
                if (userDTO.getEmail() != null) {
                    user.setEmail(userDTO.getEmail().toLowerCase());
                }
                user.setImageUrl(userDTO.getImageUrl());
                user.setActivated(userDTO.isActivated());
                user.setLangKey(userDTO.getLangKey());
                Set<Authority> managedAuthorities = user.getAuthorities();
                managedAuthorities.clear();
                userDTO
                    .getAuthorities()
                    .stream()
                    .map(authorityRepository::findById)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .forEach(managedAuthorities::add);
                userRepository.save(user);
                this.clearUserCaches(user);
                LOG.debug("Changed Information for User: {}", user);
                return user;
            })
            .map(AdminUserDTO::new);
    }

    public void deleteUser(String login) {
        userRepository
            .findOneByLogin(login)
            .ifPresent(user -> {
                userRepository.delete(user);
                this.clearUserCaches(user);
                LOG.debug("Deleted User: {}", user);
            });
    }

    public void updateUser(String firstName, String lastName, String email, String langKey, String imageUrl) {
        SecurityUtils.getCurrentUserLogin()
            .flatMap(userRepository::findOneByLogin)
            .ifPresent(user -> {
                user.setFirstName(firstName);
                user.setLastName(lastName);
                if (email != null) user.setEmail(email.toLowerCase());
                user.setLangKey(langKey);
                user.setImageUrl(imageUrl);
                userRepository.save(user);
                this.clearUserCaches(user);
                LOG.debug("Changed Information for User: {}", user);
            });
    }

    @Transactional
    public void changePassword(String currentClearTextPassword, String newPassword) {
        SecurityUtils.getCurrentUserLogin()
            .flatMap(userRepository::findOneByLogin)
            .ifPresent(user -> {
                String currentEncryptedPassword = user.getPassword();
                if (!passwordEncoder.matches(currentClearTextPassword, currentEncryptedPassword)) {
                    throw new InvalidPasswordException();
                }
                String encryptedPassword = passwordEncoder.encode(newPassword);
                user.setPassword(encryptedPassword);
                this.clearUserCaches(user);
                LOG.debug("Changed password for User: {}", user);
            });
    }

    @Transactional(readOnly = true)
    public Page<AdminUserDTO> getAllManagedUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(AdminUserDTO::new);
    }

    @Transactional(readOnly = true)
    public Page<UserDTO> getAllPublicUsers(Pageable pageable) {
        return userRepository.findAllByIdNotNullAndActivatedIsTrue(pageable).map(UserDTO::new);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthoritiesByLogin(String login) {
        return userRepository.findOneWithAuthoritiesByLogin(login);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthorities() {
        return SecurityUtils.getCurrentUserLogin().flatMap(userRepository::findOneWithAuthoritiesByLogin);
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void removeOldPersistentTokens() {
        LocalDate now = LocalDate.now();
        persistentTokenRepository
            .findByTokenDateBefore(now.minusMonths(1))
            .forEach(token -> {
                LOG.debug("Deleting token {}", token.getSeries());
                User user = token.getUser();
                user.getPersistentTokens().remove(token);
                persistentTokenRepository.delete(token);
            });
    }

    @Scheduled(cron = "0 0 1 * * ?")
    public void removeNotActivatedUsers() {
        userRepository
            .findAllByActivatedIsFalseAndActivationKeyIsNotNullAndCreatedDateBefore(Instant.now().minus(3, ChronoUnit.DAYS))
            .forEach(user -> {
                LOG.debug("Deleting not activated user {}", user.getLogin());
                userRepository.delete(user);
                this.clearUserCaches(user);
            });
    }

    @Transactional(readOnly = true)
    public List<String> getAuthorities() {
        return authorityRepository.findAll().stream().map(Authority::getName).toList();
    }

    private void clearUserCaches(User user) {
        Objects.requireNonNull(cacheManager.getCache(UserRepository.USERS_BY_LOGIN_CACHE)).evictIfPresent(user.getLogin());
        if (user.getEmail() != null) {
            Objects.requireNonNull(cacheManager.getCache(UserRepository.USERS_BY_EMAIL_CACHE)).evictIfPresent(user.getEmail());
        }
    }
}
