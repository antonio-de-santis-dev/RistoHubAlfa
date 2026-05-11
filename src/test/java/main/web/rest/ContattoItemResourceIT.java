package main.web.rest;

import static main.domain.ContattoItemAsserts.*;
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
import main.domain.ContattoItem;
import main.domain.ListaContatti;
import main.domain.enumeration.TipoContatto;
import main.repository.ContattoItemRepository;
import main.service.dto.ContattoItemDTO;
import main.service.mapper.ContattoItemMapper;
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
 * Integration tests for the {@link ContattoItemResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ContattoItemResourceIT {

    private static final TipoContatto DEFAULT_TIPO = TipoContatto.TELEFONO;
    private static final TipoContatto UPDATED_TIPO = TipoContatto.EMAIL;

    private static final String DEFAULT_VALORE = "AAAAAAAAAA";
    private static final String UPDATED_VALORE = "BBBBBBBBBB";

    private static final String DEFAULT_ETICHETTA = "AAAAAAAAAA";
    private static final String UPDATED_ETICHETTA = "BBBBBBBBBB";

    private static final Integer DEFAULT_ORDINE = 0;
    private static final Integer UPDATED_ORDINE = 1;

    private static final String ENTITY_API_URL = "/api/contatto-items";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ContattoItemRepository contattoItemRepository;

    @Autowired
    private ContattoItemMapper contattoItemMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restContattoItemMockMvc;

    private ContattoItem contattoItem;

    private ContattoItem insertedContattoItem;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ContattoItem createEntity(EntityManager em) {
        ContattoItem contattoItem = new ContattoItem()
            .tipo(DEFAULT_TIPO)
            .valore(DEFAULT_VALORE)
            .etichetta(DEFAULT_ETICHETTA)
            .ordine(DEFAULT_ORDINE);
        // Add required entity
        ListaContatti listaContatti;
        if (TestUtil.findAll(em, ListaContatti.class).isEmpty()) {
            listaContatti = ListaContattiResourceIT.createEntity();
            em.persist(listaContatti);
            em.flush();
        } else {
            listaContatti = TestUtil.findAll(em, ListaContatti.class).get(0);
        }
        contattoItem.setLista(listaContatti);
        return contattoItem;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ContattoItem createUpdatedEntity(EntityManager em) {
        ContattoItem updatedContattoItem = new ContattoItem()
            .tipo(UPDATED_TIPO)
            .valore(UPDATED_VALORE)
            .etichetta(UPDATED_ETICHETTA)
            .ordine(UPDATED_ORDINE);
        // Add required entity
        ListaContatti listaContatti;
        if (TestUtil.findAll(em, ListaContatti.class).isEmpty()) {
            listaContatti = ListaContattiResourceIT.createUpdatedEntity();
            em.persist(listaContatti);
            em.flush();
        } else {
            listaContatti = TestUtil.findAll(em, ListaContatti.class).get(0);
        }
        updatedContattoItem.setLista(listaContatti);
        return updatedContattoItem;
    }

    @BeforeEach
    void initTest() {
        contattoItem = createEntity(em);
    }

    @AfterEach
    void cleanup() {
        if (insertedContattoItem != null) {
            contattoItemRepository.delete(insertedContattoItem);
            insertedContattoItem = null;
        }
    }

    @Test
    @Transactional
    void createContattoItem() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the ContattoItem
        ContattoItemDTO contattoItemDTO = contattoItemMapper.toDto(contattoItem);
        var returnedContattoItemDTO = om.readValue(
            restContattoItemMockMvc
                .perform(
                    post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(contattoItemDTO))
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ContattoItemDTO.class
        );

        // Validate the ContattoItem in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedContattoItem = contattoItemMapper.toEntity(returnedContattoItemDTO);
        assertContattoItemUpdatableFieldsEquals(returnedContattoItem, getPersistedContattoItem(returnedContattoItem));

        insertedContattoItem = returnedContattoItem;
    }

    @Test
    @Transactional
    void createContattoItemWithExistingId() throws Exception {
        // Create the ContattoItem with an existing ID
        contattoItem.setId(1L);
        ContattoItemDTO contattoItemDTO = contattoItemMapper.toDto(contattoItem);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restContattoItemMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(contattoItemDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ContattoItem in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTipoIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        contattoItem.setTipo(null);

        // Create the ContattoItem, which fails.
        ContattoItemDTO contattoItemDTO = contattoItemMapper.toDto(contattoItem);

        restContattoItemMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(contattoItemDTO))
            )
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkValoreIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        contattoItem.setValore(null);

        // Create the ContattoItem, which fails.
        ContattoItemDTO contattoItemDTO = contattoItemMapper.toDto(contattoItem);

        restContattoItemMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(contattoItemDTO))
            )
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkOrdineIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        contattoItem.setOrdine(null);

        // Create the ContattoItem, which fails.
        ContattoItemDTO contattoItemDTO = contattoItemMapper.toDto(contattoItem);

        restContattoItemMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(contattoItemDTO))
            )
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllContattoItems() throws Exception {
        // Initialize the database
        insertedContattoItem = contattoItemRepository.saveAndFlush(contattoItem);

        // Get all the contattoItemList
        restContattoItemMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(contattoItem.getId().intValue())))
            .andExpect(jsonPath("$.[*].tipo").value(hasItem(DEFAULT_TIPO.toString())))
            .andExpect(jsonPath("$.[*].valore").value(hasItem(DEFAULT_VALORE)))
            .andExpect(jsonPath("$.[*].etichetta").value(hasItem(DEFAULT_ETICHETTA)))
            .andExpect(jsonPath("$.[*].ordine").value(hasItem(DEFAULT_ORDINE)));
    }

    @Test
    @Transactional
    void getContattoItem() throws Exception {
        // Initialize the database
        insertedContattoItem = contattoItemRepository.saveAndFlush(contattoItem);

        // Get the contattoItem
        restContattoItemMockMvc
            .perform(get(ENTITY_API_URL_ID, contattoItem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(contattoItem.getId().intValue()))
            .andExpect(jsonPath("$.tipo").value(DEFAULT_TIPO.toString()))
            .andExpect(jsonPath("$.valore").value(DEFAULT_VALORE))
            .andExpect(jsonPath("$.etichetta").value(DEFAULT_ETICHETTA))
            .andExpect(jsonPath("$.ordine").value(DEFAULT_ORDINE));
    }

    @Test
    @Transactional
    void getNonExistingContattoItem() throws Exception {
        // Get the contattoItem
        restContattoItemMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingContattoItem() throws Exception {
        // Initialize the database
        insertedContattoItem = contattoItemRepository.saveAndFlush(contattoItem);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the contattoItem
        ContattoItem updatedContattoItem = contattoItemRepository.findById(contattoItem.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedContattoItem are not directly saved in db
        em.detach(updatedContattoItem);
        updatedContattoItem.tipo(UPDATED_TIPO).valore(UPDATED_VALORE).etichetta(UPDATED_ETICHETTA).ordine(UPDATED_ORDINE);
        ContattoItemDTO contattoItemDTO = contattoItemMapper.toDto(updatedContattoItem);

        restContattoItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, contattoItemDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(contattoItemDTO))
            )
            .andExpect(status().isOk());

        // Validate the ContattoItem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedContattoItemToMatchAllProperties(updatedContattoItem);
    }

    @Test
    @Transactional
    void putNonExistingContattoItem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        contattoItem.setId(longCount.incrementAndGet());

        // Create the ContattoItem
        ContattoItemDTO contattoItemDTO = contattoItemMapper.toDto(contattoItem);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restContattoItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, contattoItemDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(contattoItemDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ContattoItem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchContattoItem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        contattoItem.setId(longCount.incrementAndGet());

        // Create the ContattoItem
        ContattoItemDTO contattoItemDTO = contattoItemMapper.toDto(contattoItem);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContattoItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(contattoItemDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ContattoItem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamContattoItem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        contattoItem.setId(longCount.incrementAndGet());

        // Create the ContattoItem
        ContattoItemDTO contattoItemDTO = contattoItemMapper.toDto(contattoItem);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContattoItemMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(contattoItemDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ContattoItem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateContattoItemWithPatch() throws Exception {
        // Initialize the database
        insertedContattoItem = contattoItemRepository.saveAndFlush(contattoItem);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the contattoItem using partial update
        ContattoItem partialUpdatedContattoItem = new ContattoItem();
        partialUpdatedContattoItem.setId(contattoItem.getId());

        partialUpdatedContattoItem.ordine(UPDATED_ORDINE);

        restContattoItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedContattoItem.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedContattoItem))
            )
            .andExpect(status().isOk());

        // Validate the ContattoItem in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertContattoItemUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedContattoItem, contattoItem),
            getPersistedContattoItem(contattoItem)
        );
    }

    @Test
    @Transactional
    void fullUpdateContattoItemWithPatch() throws Exception {
        // Initialize the database
        insertedContattoItem = contattoItemRepository.saveAndFlush(contattoItem);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the contattoItem using partial update
        ContattoItem partialUpdatedContattoItem = new ContattoItem();
        partialUpdatedContattoItem.setId(contattoItem.getId());

        partialUpdatedContattoItem.tipo(UPDATED_TIPO).valore(UPDATED_VALORE).etichetta(UPDATED_ETICHETTA).ordine(UPDATED_ORDINE);

        restContattoItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedContattoItem.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedContattoItem))
            )
            .andExpect(status().isOk());

        // Validate the ContattoItem in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertContattoItemUpdatableFieldsEquals(partialUpdatedContattoItem, getPersistedContattoItem(partialUpdatedContattoItem));
    }

    @Test
    @Transactional
    void patchNonExistingContattoItem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        contattoItem.setId(longCount.incrementAndGet());

        // Create the ContattoItem
        ContattoItemDTO contattoItemDTO = contattoItemMapper.toDto(contattoItem);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restContattoItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, contattoItemDTO.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(contattoItemDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ContattoItem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchContattoItem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        contattoItem.setId(longCount.incrementAndGet());

        // Create the ContattoItem
        ContattoItemDTO contattoItemDTO = contattoItemMapper.toDto(contattoItem);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContattoItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(contattoItemDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ContattoItem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamContattoItem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        contattoItem.setId(longCount.incrementAndGet());

        // Create the ContattoItem
        ContattoItemDTO contattoItemDTO = contattoItemMapper.toDto(contattoItem);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContattoItemMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(contattoItemDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ContattoItem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteContattoItem() throws Exception {
        // Initialize the database
        insertedContattoItem = contattoItemRepository.saveAndFlush(contattoItem);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the contattoItem
        restContattoItemMockMvc
            .perform(delete(ENTITY_API_URL_ID, contattoItem.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return contattoItemRepository.count();
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

    protected ContattoItem getPersistedContattoItem(ContattoItem contattoItem) {
        return contattoItemRepository.findById(contattoItem.getId()).orElseThrow();
    }

    protected void assertPersistedContattoItemToMatchAllProperties(ContattoItem expectedContattoItem) {
        assertContattoItemAllPropertiesEquals(expectedContattoItem, getPersistedContattoItem(expectedContattoItem));
    }

    protected void assertPersistedContattoItemToMatchUpdatableProperties(ContattoItem expectedContattoItem) {
        assertContattoItemAllUpdatablePropertiesEquals(expectedContattoItem, getPersistedContattoItem(expectedContattoItem));
    }
}
