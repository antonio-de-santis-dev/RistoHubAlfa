package main.web.rest;

import static main.domain.TraduzioneMenuAsserts.*;
import static main.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import main.IntegrationTest;
import main.domain.Menu;
import main.domain.TraduzioneMenu;
import main.repository.TraduzioneMenuRepository;
import main.service.dto.TraduzioneMenuDTO;
import main.service.mapper.TraduzioneMenuMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TraduzioneMenuResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TraduzioneMenuResourceIT {

    private static final String DEFAULT_LINGUA = "AAAAA";
    private static final String UPDATED_LINGUA = "BBBBB";

    private static final String DEFAULT_CONTENUTO_JSON = "AAAAAAAAAA";
    private static final String UPDATED_CONTENUTO_JSON = "BBBBBBBBBB";

    private static final Boolean DEFAULT_MODIFICATA = false;
    private static final Boolean UPDATED_MODIFICATA = true;

    private static final String ENTITY_API_URL = "/api/traduzione-menus";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private TraduzioneMenuRepository traduzioneMenuRepository;

    @Autowired
    private TraduzioneMenuMapper traduzioneMenuMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTraduzioneMenuMockMvc;

    private TraduzioneMenu traduzioneMenu;

    private TraduzioneMenu insertedTraduzioneMenu;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TraduzioneMenu createEntity(EntityManager em) {
        TraduzioneMenu traduzioneMenu = new TraduzioneMenu()
            .lingua(DEFAULT_LINGUA)
            .contenutoJson(DEFAULT_CONTENUTO_JSON)
            .modificata(DEFAULT_MODIFICATA);
        // Add required entity
        Menu menu;
        if (TestUtil.findAll(em, Menu.class).isEmpty()) {
            menu = MenuResourceIT.createEntity(em);
            em.persist(menu);
            em.flush();
        } else {
            menu = TestUtil.findAll(em, Menu.class).get(0);
        }
        traduzioneMenu.setMenu(menu);
        return traduzioneMenu;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TraduzioneMenu createUpdatedEntity(EntityManager em) {
        TraduzioneMenu updatedTraduzioneMenu = new TraduzioneMenu()
            .lingua(UPDATED_LINGUA)
            .contenutoJson(UPDATED_CONTENUTO_JSON)
            .modificata(UPDATED_MODIFICATA);
        // Add required entity
        Menu menu;
        if (TestUtil.findAll(em, Menu.class).isEmpty()) {
            menu = MenuResourceIT.createUpdatedEntity(em);
            em.persist(menu);
            em.flush();
        } else {
            menu = TestUtil.findAll(em, Menu.class).get(0);
        }
        updatedTraduzioneMenu.setMenu(menu);
        return updatedTraduzioneMenu;
    }

    @BeforeEach
    void initTest() {
        traduzioneMenu = createEntity(em);
    }

    @AfterEach
    void cleanup() {
        if (insertedTraduzioneMenu != null) {
            traduzioneMenuRepository.delete(insertedTraduzioneMenu);
            insertedTraduzioneMenu = null;
        }
    }

    @Test
    @Transactional
    void createTraduzioneMenu() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the TraduzioneMenu
        TraduzioneMenuDTO traduzioneMenuDTO = traduzioneMenuMapper.toDto(traduzioneMenu);
        var returnedTraduzioneMenuDTO = om.readValue(
            restTraduzioneMenuMockMvc
                .perform(
                    post(ENTITY_API_URL)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsBytes(traduzioneMenuDTO))
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            TraduzioneMenuDTO.class
        );

        // Validate the TraduzioneMenu in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedTraduzioneMenu = traduzioneMenuMapper.toEntity(returnedTraduzioneMenuDTO);
        assertTraduzioneMenuUpdatableFieldsEquals(returnedTraduzioneMenu, getPersistedTraduzioneMenu(returnedTraduzioneMenu));

        insertedTraduzioneMenu = returnedTraduzioneMenu;
    }

    @Test
    @Transactional
    void createTraduzioneMenuWithExistingId() throws Exception {
        // Create the TraduzioneMenu with an existing ID
        traduzioneMenu.setId(1L);
        TraduzioneMenuDTO traduzioneMenuDTO = traduzioneMenuMapper.toDto(traduzioneMenu);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTraduzioneMenuMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(traduzioneMenuDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the TraduzioneMenu in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkLinguaIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        traduzioneMenu.setLingua(null);

        // Create the TraduzioneMenu, which fails.
        TraduzioneMenuDTO traduzioneMenuDTO = traduzioneMenuMapper.toDto(traduzioneMenu);

        restTraduzioneMenuMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(traduzioneMenuDTO))
            )
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkModificataIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        traduzioneMenu.setModificata(null);

        // Create the TraduzioneMenu, which fails.
        TraduzioneMenuDTO traduzioneMenuDTO = traduzioneMenuMapper.toDto(traduzioneMenu);

        restTraduzioneMenuMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(traduzioneMenuDTO))
            )
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTraduzioneMenus() throws Exception {
        // Initialize the database
        insertedTraduzioneMenu = traduzioneMenuRepository.saveAndFlush(traduzioneMenu);

        // Get all the traduzioneMenuList
        restTraduzioneMenuMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(traduzioneMenu.getId().intValue())))
            .andExpect(jsonPath("$.[*].lingua").value(hasItem(DEFAULT_LINGUA)))
            .andExpect(jsonPath("$.[*].contenutoJson").value(hasItem(DEFAULT_CONTENUTO_JSON)))
            .andExpect(jsonPath("$.[*].modificata").value(hasItem(DEFAULT_MODIFICATA)));
    }

    @Test
    @Transactional
    void getTraduzioneMenu() throws Exception {
        // Initialize the database
        insertedTraduzioneMenu = traduzioneMenuRepository.saveAndFlush(traduzioneMenu);

        // Get the traduzioneMenu
        restTraduzioneMenuMockMvc
            .perform(get(ENTITY_API_URL_ID, traduzioneMenu.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(traduzioneMenu.getId().intValue()))
            .andExpect(jsonPath("$.lingua").value(DEFAULT_LINGUA))
            .andExpect(jsonPath("$.contenutoJson").value(DEFAULT_CONTENUTO_JSON))
            .andExpect(jsonPath("$.modificata").value(DEFAULT_MODIFICATA));
    }

    @Test
    @Transactional
    void getNonExistingTraduzioneMenu() throws Exception {
        // Get the traduzioneMenu
        restTraduzioneMenuMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTraduzioneMenu() throws Exception {
        // Initialize the database
        insertedTraduzioneMenu = traduzioneMenuRepository.saveAndFlush(traduzioneMenu);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the traduzioneMenu
        TraduzioneMenu updatedTraduzioneMenu = traduzioneMenuRepository.findById(traduzioneMenu.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTraduzioneMenu are not directly saved in db
        em.detach(updatedTraduzioneMenu);
        updatedTraduzioneMenu.lingua(UPDATED_LINGUA).contenutoJson(UPDATED_CONTENUTO_JSON).modificata(UPDATED_MODIFICATA);
        TraduzioneMenuDTO traduzioneMenuDTO = traduzioneMenuMapper.toDto(updatedTraduzioneMenu);

        restTraduzioneMenuMockMvc
            .perform(
                put(ENTITY_API_URL_ID, traduzioneMenuDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(traduzioneMenuDTO))
            )
            .andExpect(status().isOk());

        // Validate the TraduzioneMenu in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedTraduzioneMenuToMatchAllProperties(updatedTraduzioneMenu);
    }

    @Test
    @Transactional
    void putNonExistingTraduzioneMenu() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        traduzioneMenu.setId(longCount.incrementAndGet());

        // Create the TraduzioneMenu
        TraduzioneMenuDTO traduzioneMenuDTO = traduzioneMenuMapper.toDto(traduzioneMenu);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTraduzioneMenuMockMvc
            .perform(
                put(ENTITY_API_URL_ID, traduzioneMenuDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(traduzioneMenuDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the TraduzioneMenu in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTraduzioneMenu() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        traduzioneMenu.setId(longCount.incrementAndGet());

        // Create the TraduzioneMenu
        TraduzioneMenuDTO traduzioneMenuDTO = traduzioneMenuMapper.toDto(traduzioneMenu);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTraduzioneMenuMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(traduzioneMenuDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the TraduzioneMenu in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTraduzioneMenu() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        traduzioneMenu.setId(longCount.incrementAndGet());

        // Create the TraduzioneMenu
        TraduzioneMenuDTO traduzioneMenuDTO = traduzioneMenuMapper.toDto(traduzioneMenu);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTraduzioneMenuMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(traduzioneMenuDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TraduzioneMenu in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTraduzioneMenuWithPatch() throws Exception {
        // Initialize the database
        insertedTraduzioneMenu = traduzioneMenuRepository.saveAndFlush(traduzioneMenu);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the traduzioneMenu using partial update
        TraduzioneMenu partialUpdatedTraduzioneMenu = new TraduzioneMenu();
        partialUpdatedTraduzioneMenu.setId(traduzioneMenu.getId());

        partialUpdatedTraduzioneMenu.lingua(UPDATED_LINGUA).contenutoJson(UPDATED_CONTENUTO_JSON);

        restTraduzioneMenuMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTraduzioneMenu.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTraduzioneMenu))
            )
            .andExpect(status().isOk());

        // Validate the TraduzioneMenu in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTraduzioneMenuUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedTraduzioneMenu, traduzioneMenu),
            getPersistedTraduzioneMenu(traduzioneMenu)
        );
    }

    @Test
    @Transactional
    void fullUpdateTraduzioneMenuWithPatch() throws Exception {
        // Initialize the database
        insertedTraduzioneMenu = traduzioneMenuRepository.saveAndFlush(traduzioneMenu);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the traduzioneMenu using partial update
        TraduzioneMenu partialUpdatedTraduzioneMenu = new TraduzioneMenu();
        partialUpdatedTraduzioneMenu.setId(traduzioneMenu.getId());

        partialUpdatedTraduzioneMenu.lingua(UPDATED_LINGUA).contenutoJson(UPDATED_CONTENUTO_JSON).modificata(UPDATED_MODIFICATA);

        restTraduzioneMenuMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTraduzioneMenu.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTraduzioneMenu))
            )
            .andExpect(status().isOk());

        // Validate the TraduzioneMenu in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTraduzioneMenuUpdatableFieldsEquals(partialUpdatedTraduzioneMenu, getPersistedTraduzioneMenu(partialUpdatedTraduzioneMenu));
    }

    @Test
    @Transactional
    void patchNonExistingTraduzioneMenu() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        traduzioneMenu.setId(longCount.incrementAndGet());

        // Create the TraduzioneMenu
        TraduzioneMenuDTO traduzioneMenuDTO = traduzioneMenuMapper.toDto(traduzioneMenu);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTraduzioneMenuMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, traduzioneMenuDTO.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(traduzioneMenuDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the TraduzioneMenu in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTraduzioneMenu() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        traduzioneMenu.setId(longCount.incrementAndGet());

        // Create the TraduzioneMenu
        TraduzioneMenuDTO traduzioneMenuDTO = traduzioneMenuMapper.toDto(traduzioneMenu);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTraduzioneMenuMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(traduzioneMenuDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the TraduzioneMenu in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTraduzioneMenu() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        traduzioneMenu.setId(longCount.incrementAndGet());

        // Create the TraduzioneMenu
        TraduzioneMenuDTO traduzioneMenuDTO = traduzioneMenuMapper.toDto(traduzioneMenu);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTraduzioneMenuMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(traduzioneMenuDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TraduzioneMenu in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTraduzioneMenu() throws Exception {
        // Initialize the database
        insertedTraduzioneMenu = traduzioneMenuRepository.saveAndFlush(traduzioneMenu);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the traduzioneMenu
        restTraduzioneMenuMockMvc
            .perform(delete(ENTITY_API_URL_ID, traduzioneMenu.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return traduzioneMenuRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected TraduzioneMenu getPersistedTraduzioneMenu(TraduzioneMenu traduzioneMenu) {
        return traduzioneMenuRepository.findById(traduzioneMenu.getId()).orElseThrow();
    }

    protected void assertPersistedTraduzioneMenuToMatchAllProperties(TraduzioneMenu expectedTraduzioneMenu) {
        assertTraduzioneMenuAllPropertiesEquals(expectedTraduzioneMenu, getPersistedTraduzioneMenu(expectedTraduzioneMenu));
    }

    protected void assertPersistedTraduzioneMenuToMatchUpdatableProperties(TraduzioneMenu expectedTraduzioneMenu) {
        assertTraduzioneMenuAllUpdatablePropertiesEquals(expectedTraduzioneMenu, getPersistedTraduzioneMenu(expectedTraduzioneMenu));
    }
}
