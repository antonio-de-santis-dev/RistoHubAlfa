package main.web.rest;

import static main.domain.ProfiloRistoratoreAsserts.*;
import static main.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import main.IntegrationTest;
import main.domain.ProfiloRistoratore;
import main.domain.User;
import main.domain.enumeration.LivelloUtente;
import main.repository.ProfiloRistoratoreRepository;
import main.repository.UserRepository;
import main.service.ProfiloRistoratoreService;
import main.service.dto.ProfiloRistoratoreDTO;
import main.service.mapper.ProfiloRistoratoreMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ProfiloRistoratoreResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ProfiloRistoratoreResourceIT {

    private static final LivelloUtente DEFAULT_LIVELLO = LivelloUtente.LIVELLO_1;
    private static final LivelloUtente UPDATED_LIVELLO = LivelloUtente.LIVELLO_2;

    private static final String ENTITY_API_URL = "/api/profilo-ristoratores";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ProfiloRistoratoreRepository profiloRistoratoreRepository;

    @Autowired
    private UserRepository userRepository;

    @Mock
    private ProfiloRistoratoreRepository profiloRistoratoreRepositoryMock;

    @Autowired
    private ProfiloRistoratoreMapper profiloRistoratoreMapper;

    @Mock
    private ProfiloRistoratoreService profiloRistoratoreServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProfiloRistoratoreMockMvc;

    private ProfiloRistoratore profiloRistoratore;

    private ProfiloRistoratore insertedProfiloRistoratore;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProfiloRistoratore createEntity(EntityManager em) {
        ProfiloRistoratore profiloRistoratore = new ProfiloRistoratore().livello(DEFAULT_LIVELLO);
        // Add required entity
        User user = UserResourceIT.createEntity();
        em.persist(user);
        em.flush();
        profiloRistoratore.setUser(user);
        return profiloRistoratore;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProfiloRistoratore createUpdatedEntity(EntityManager em) {
        ProfiloRistoratore updatedProfiloRistoratore = new ProfiloRistoratore().livello(UPDATED_LIVELLO);
        // Add required entity
        User user = UserResourceIT.createEntity();
        em.persist(user);
        em.flush();
        updatedProfiloRistoratore.setUser(user);
        return updatedProfiloRistoratore;
    }

    @BeforeEach
    void initTest() {
        profiloRistoratore = createEntity(em);
    }

    @AfterEach
    void cleanup() {
        if (insertedProfiloRistoratore != null) {
            profiloRistoratoreRepository.delete(insertedProfiloRistoratore);
            insertedProfiloRistoratore = null;
        }
    }

    @Test
    @Transactional
    void createProfiloRistoratore() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the ProfiloRistoratore
        ProfiloRistoratoreDTO profiloRistoratoreDTO = profiloRistoratoreMapper.toDto(profiloRistoratore);
        var returnedProfiloRistoratoreDTO = om.readValue(
            restProfiloRistoratoreMockMvc
                .perform(
                    post(ENTITY_API_URL)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsBytes(profiloRistoratoreDTO))
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ProfiloRistoratoreDTO.class
        );

        // Validate the ProfiloRistoratore in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedProfiloRistoratore = profiloRistoratoreMapper.toEntity(returnedProfiloRistoratoreDTO);
        assertProfiloRistoratoreUpdatableFieldsEquals(
            returnedProfiloRistoratore,
            getPersistedProfiloRistoratore(returnedProfiloRistoratore)
        );

        insertedProfiloRistoratore = returnedProfiloRistoratore;
    }

    @Test
    @Transactional
    void createProfiloRistoratoreWithExistingId() throws Exception {
        // Create the ProfiloRistoratore with an existing ID
        profiloRistoratore.setId(1L);
        ProfiloRistoratoreDTO profiloRistoratoreDTO = profiloRistoratoreMapper.toDto(profiloRistoratore);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProfiloRistoratoreMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(profiloRistoratoreDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProfiloRistoratore in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkLivelloIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        profiloRistoratore.setLivello(null);

        // Create the ProfiloRistoratore, which fails.
        ProfiloRistoratoreDTO profiloRistoratoreDTO = profiloRistoratoreMapper.toDto(profiloRistoratore);

        restProfiloRistoratoreMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(profiloRistoratoreDTO))
            )
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllProfiloRistoratores() throws Exception {
        // Initialize the database
        insertedProfiloRistoratore = profiloRistoratoreRepository.saveAndFlush(profiloRistoratore);

        // Get all the profiloRistoratoreList
        restProfiloRistoratoreMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(profiloRistoratore.getId().intValue())))
            .andExpect(jsonPath("$.[*].livello").value(hasItem(DEFAULT_LIVELLO.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllProfiloRistoratoresWithEagerRelationshipsIsEnabled() throws Exception {
        when(profiloRistoratoreServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restProfiloRistoratoreMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(profiloRistoratoreServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllProfiloRistoratoresWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(profiloRistoratoreServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restProfiloRistoratoreMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(profiloRistoratoreRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getProfiloRistoratore() throws Exception {
        // Initialize the database
        insertedProfiloRistoratore = profiloRistoratoreRepository.saveAndFlush(profiloRistoratore);

        // Get the profiloRistoratore
        restProfiloRistoratoreMockMvc
            .perform(get(ENTITY_API_URL_ID, profiloRistoratore.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(profiloRistoratore.getId().intValue()))
            .andExpect(jsonPath("$.livello").value(DEFAULT_LIVELLO.toString()));
    }

    @Test
    @Transactional
    void getNonExistingProfiloRistoratore() throws Exception {
        // Get the profiloRistoratore
        restProfiloRistoratoreMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingProfiloRistoratore() throws Exception {
        // Initialize the database
        insertedProfiloRistoratore = profiloRistoratoreRepository.saveAndFlush(profiloRistoratore);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the profiloRistoratore
        ProfiloRistoratore updatedProfiloRistoratore = profiloRistoratoreRepository.findById(profiloRistoratore.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedProfiloRistoratore are not directly saved in db
        em.detach(updatedProfiloRistoratore);
        updatedProfiloRistoratore.livello(UPDATED_LIVELLO);
        ProfiloRistoratoreDTO profiloRistoratoreDTO = profiloRistoratoreMapper.toDto(updatedProfiloRistoratore);

        restProfiloRistoratoreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, profiloRistoratoreDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(profiloRistoratoreDTO))
            )
            .andExpect(status().isOk());

        // Validate the ProfiloRistoratore in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedProfiloRistoratoreToMatchAllProperties(updatedProfiloRistoratore);
    }

    @Test
    @Transactional
    void putNonExistingProfiloRistoratore() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        profiloRistoratore.setId(longCount.incrementAndGet());

        // Create the ProfiloRistoratore
        ProfiloRistoratoreDTO profiloRistoratoreDTO = profiloRistoratoreMapper.toDto(profiloRistoratore);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProfiloRistoratoreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, profiloRistoratoreDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(profiloRistoratoreDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProfiloRistoratore in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProfiloRistoratore() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        profiloRistoratore.setId(longCount.incrementAndGet());

        // Create the ProfiloRistoratore
        ProfiloRistoratoreDTO profiloRistoratoreDTO = profiloRistoratoreMapper.toDto(profiloRistoratore);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProfiloRistoratoreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(profiloRistoratoreDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProfiloRistoratore in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProfiloRistoratore() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        profiloRistoratore.setId(longCount.incrementAndGet());

        // Create the ProfiloRistoratore
        ProfiloRistoratoreDTO profiloRistoratoreDTO = profiloRistoratoreMapper.toDto(profiloRistoratore);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProfiloRistoratoreMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(profiloRistoratoreDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProfiloRistoratore in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProfiloRistoratoreWithPatch() throws Exception {
        // Initialize the database
        insertedProfiloRistoratore = profiloRistoratoreRepository.saveAndFlush(profiloRistoratore);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the profiloRistoratore using partial update
        ProfiloRistoratore partialUpdatedProfiloRistoratore = new ProfiloRistoratore();
        partialUpdatedProfiloRistoratore.setId(profiloRistoratore.getId());

        restProfiloRistoratoreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProfiloRistoratore.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedProfiloRistoratore))
            )
            .andExpect(status().isOk());

        // Validate the ProfiloRistoratore in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertProfiloRistoratoreUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedProfiloRistoratore, profiloRistoratore),
            getPersistedProfiloRistoratore(profiloRistoratore)
        );
    }

    @Test
    @Transactional
    void fullUpdateProfiloRistoratoreWithPatch() throws Exception {
        // Initialize the database
        insertedProfiloRistoratore = profiloRistoratoreRepository.saveAndFlush(profiloRistoratore);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the profiloRistoratore using partial update
        ProfiloRistoratore partialUpdatedProfiloRistoratore = new ProfiloRistoratore();
        partialUpdatedProfiloRistoratore.setId(profiloRistoratore.getId());

        partialUpdatedProfiloRistoratore.livello(UPDATED_LIVELLO);

        restProfiloRistoratoreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProfiloRistoratore.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedProfiloRistoratore))
            )
            .andExpect(status().isOk());

        // Validate the ProfiloRistoratore in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertProfiloRistoratoreUpdatableFieldsEquals(
            partialUpdatedProfiloRistoratore,
            getPersistedProfiloRistoratore(partialUpdatedProfiloRistoratore)
        );
    }

    @Test
    @Transactional
    void patchNonExistingProfiloRistoratore() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        profiloRistoratore.setId(longCount.incrementAndGet());

        // Create the ProfiloRistoratore
        ProfiloRistoratoreDTO profiloRistoratoreDTO = profiloRistoratoreMapper.toDto(profiloRistoratore);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProfiloRistoratoreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, profiloRistoratoreDTO.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(profiloRistoratoreDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProfiloRistoratore in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProfiloRistoratore() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        profiloRistoratore.setId(longCount.incrementAndGet());

        // Create the ProfiloRistoratore
        ProfiloRistoratoreDTO profiloRistoratoreDTO = profiloRistoratoreMapper.toDto(profiloRistoratore);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProfiloRistoratoreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(profiloRistoratoreDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProfiloRistoratore in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProfiloRistoratore() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        profiloRistoratore.setId(longCount.incrementAndGet());

        // Create the ProfiloRistoratore
        ProfiloRistoratoreDTO profiloRistoratoreDTO = profiloRistoratoreMapper.toDto(profiloRistoratore);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProfiloRistoratoreMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(profiloRistoratoreDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProfiloRistoratore in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProfiloRistoratore() throws Exception {
        // Initialize the database
        insertedProfiloRistoratore = profiloRistoratoreRepository.saveAndFlush(profiloRistoratore);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the profiloRistoratore
        restProfiloRistoratoreMockMvc
            .perform(delete(ENTITY_API_URL_ID, profiloRistoratore.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return profiloRistoratoreRepository.count();
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

    protected ProfiloRistoratore getPersistedProfiloRistoratore(ProfiloRistoratore profiloRistoratore) {
        return profiloRistoratoreRepository.findById(profiloRistoratore.getId()).orElseThrow();
    }

    protected void assertPersistedProfiloRistoratoreToMatchAllProperties(ProfiloRistoratore expectedProfiloRistoratore) {
        assertProfiloRistoratoreAllPropertiesEquals(expectedProfiloRistoratore, getPersistedProfiloRistoratore(expectedProfiloRistoratore));
    }

    protected void assertPersistedProfiloRistoratoreToMatchUpdatableProperties(ProfiloRistoratore expectedProfiloRistoratore) {
        assertProfiloRistoratoreAllUpdatablePropertiesEquals(
            expectedProfiloRistoratore,
            getPersistedProfiloRistoratore(expectedProfiloRistoratore)
        );
    }
}
