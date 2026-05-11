package main.web.rest;

import static main.domain.ListaContattiAsserts.*;
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
import main.domain.ListaContatti;
import main.repository.ListaContattiRepository;
import main.service.dto.ListaContattiDTO;
import main.service.mapper.ListaContattiMapper;
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
 * Integration tests for the {@link ListaContattiResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ListaContattiResourceIT {

    private static final String DEFAULT_NOTE = "AAAAAAAAAA";
    private static final String UPDATED_NOTE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/lista-contattis";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ListaContattiRepository listaContattiRepository;

    @Autowired
    private ListaContattiMapper listaContattiMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restListaContattiMockMvc;

    private ListaContatti listaContatti;

    private ListaContatti insertedListaContatti;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ListaContatti createEntity() {
        return new ListaContatti().note(DEFAULT_NOTE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ListaContatti createUpdatedEntity() {
        return new ListaContatti().note(UPDATED_NOTE);
    }

    @BeforeEach
    void initTest() {
        listaContatti = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedListaContatti != null) {
            listaContattiRepository.delete(insertedListaContatti);
            insertedListaContatti = null;
        }
    }

    @Test
    @Transactional
    void createListaContatti() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the ListaContatti
        ListaContattiDTO listaContattiDTO = listaContattiMapper.toDto(listaContatti);
        var returnedListaContattiDTO = om.readValue(
            restListaContattiMockMvc
                .perform(
                    post(ENTITY_API_URL)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsBytes(listaContattiDTO))
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ListaContattiDTO.class
        );

        // Validate the ListaContatti in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedListaContatti = listaContattiMapper.toEntity(returnedListaContattiDTO);
        assertListaContattiUpdatableFieldsEquals(returnedListaContatti, getPersistedListaContatti(returnedListaContatti));

        insertedListaContatti = returnedListaContatti;
    }

    @Test
    @Transactional
    void createListaContattiWithExistingId() throws Exception {
        // Create the ListaContatti with an existing ID
        listaContatti.setId(1L);
        ListaContattiDTO listaContattiDTO = listaContattiMapper.toDto(listaContatti);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restListaContattiMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(listaContattiDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ListaContatti in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllListaContattis() throws Exception {
        // Initialize the database
        insertedListaContatti = listaContattiRepository.saveAndFlush(listaContatti);

        // Get all the listaContattiList
        restListaContattiMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(listaContatti.getId().intValue())))
            .andExpect(jsonPath("$.[*].note").value(hasItem(DEFAULT_NOTE)));
    }

    @Test
    @Transactional
    void getListaContatti() throws Exception {
        // Initialize the database
        insertedListaContatti = listaContattiRepository.saveAndFlush(listaContatti);

        // Get the listaContatti
        restListaContattiMockMvc
            .perform(get(ENTITY_API_URL_ID, listaContatti.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(listaContatti.getId().intValue()))
            .andExpect(jsonPath("$.note").value(DEFAULT_NOTE));
    }

    @Test
    @Transactional
    void getNonExistingListaContatti() throws Exception {
        // Get the listaContatti
        restListaContattiMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingListaContatti() throws Exception {
        // Initialize the database
        insertedListaContatti = listaContattiRepository.saveAndFlush(listaContatti);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the listaContatti
        ListaContatti updatedListaContatti = listaContattiRepository.findById(listaContatti.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedListaContatti are not directly saved in db
        em.detach(updatedListaContatti);
        updatedListaContatti.note(UPDATED_NOTE);
        ListaContattiDTO listaContattiDTO = listaContattiMapper.toDto(updatedListaContatti);

        restListaContattiMockMvc
            .perform(
                put(ENTITY_API_URL_ID, listaContattiDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(listaContattiDTO))
            )
            .andExpect(status().isOk());

        // Validate the ListaContatti in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedListaContattiToMatchAllProperties(updatedListaContatti);
    }

    @Test
    @Transactional
    void putNonExistingListaContatti() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        listaContatti.setId(longCount.incrementAndGet());

        // Create the ListaContatti
        ListaContattiDTO listaContattiDTO = listaContattiMapper.toDto(listaContatti);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restListaContattiMockMvc
            .perform(
                put(ENTITY_API_URL_ID, listaContattiDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(listaContattiDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ListaContatti in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchListaContatti() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        listaContatti.setId(longCount.incrementAndGet());

        // Create the ListaContatti
        ListaContattiDTO listaContattiDTO = listaContattiMapper.toDto(listaContatti);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restListaContattiMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(listaContattiDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ListaContatti in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamListaContatti() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        listaContatti.setId(longCount.incrementAndGet());

        // Create the ListaContatti
        ListaContattiDTO listaContattiDTO = listaContattiMapper.toDto(listaContatti);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restListaContattiMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(listaContattiDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ListaContatti in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateListaContattiWithPatch() throws Exception {
        // Initialize the database
        insertedListaContatti = listaContattiRepository.saveAndFlush(listaContatti);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the listaContatti using partial update
        ListaContatti partialUpdatedListaContatti = new ListaContatti();
        partialUpdatedListaContatti.setId(listaContatti.getId());

        restListaContattiMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedListaContatti.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedListaContatti))
            )
            .andExpect(status().isOk());

        // Validate the ListaContatti in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertListaContattiUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedListaContatti, listaContatti),
            getPersistedListaContatti(listaContatti)
        );
    }

    @Test
    @Transactional
    void fullUpdateListaContattiWithPatch() throws Exception {
        // Initialize the database
        insertedListaContatti = listaContattiRepository.saveAndFlush(listaContatti);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the listaContatti using partial update
        ListaContatti partialUpdatedListaContatti = new ListaContatti();
        partialUpdatedListaContatti.setId(listaContatti.getId());

        partialUpdatedListaContatti.note(UPDATED_NOTE);

        restListaContattiMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedListaContatti.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedListaContatti))
            )
            .andExpect(status().isOk());

        // Validate the ListaContatti in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertListaContattiUpdatableFieldsEquals(partialUpdatedListaContatti, getPersistedListaContatti(partialUpdatedListaContatti));
    }

    @Test
    @Transactional
    void patchNonExistingListaContatti() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        listaContatti.setId(longCount.incrementAndGet());

        // Create the ListaContatti
        ListaContattiDTO listaContattiDTO = listaContattiMapper.toDto(listaContatti);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restListaContattiMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, listaContattiDTO.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(listaContattiDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ListaContatti in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchListaContatti() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        listaContatti.setId(longCount.incrementAndGet());

        // Create the ListaContatti
        ListaContattiDTO listaContattiDTO = listaContattiMapper.toDto(listaContatti);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restListaContattiMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(listaContattiDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ListaContatti in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamListaContatti() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        listaContatti.setId(longCount.incrementAndGet());

        // Create the ListaContatti
        ListaContattiDTO listaContattiDTO = listaContattiMapper.toDto(listaContatti);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restListaContattiMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(listaContattiDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ListaContatti in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteListaContatti() throws Exception {
        // Initialize the database
        insertedListaContatti = listaContattiRepository.saveAndFlush(listaContatti);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the listaContatti
        restListaContattiMockMvc
            .perform(delete(ENTITY_API_URL_ID, listaContatti.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return listaContattiRepository.count();
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

    protected ListaContatti getPersistedListaContatti(ListaContatti listaContatti) {
        return listaContattiRepository.findById(listaContatti.getId()).orElseThrow();
    }

    protected void assertPersistedListaContattiToMatchAllProperties(ListaContatti expectedListaContatti) {
        assertListaContattiAllPropertiesEquals(expectedListaContatti, getPersistedListaContatti(expectedListaContatti));
    }

    protected void assertPersistedListaContattiToMatchUpdatableProperties(ListaContatti expectedListaContatti) {
        assertListaContattiAllUpdatablePropertiesEquals(expectedListaContatti, getPersistedListaContatti(expectedListaContatti));
    }
}
