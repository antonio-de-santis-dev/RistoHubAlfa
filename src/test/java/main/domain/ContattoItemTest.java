package main.domain;

import static main.domain.ContattoItemTestSamples.*;
import static main.domain.ListaContattiTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import main.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ContattoItemTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ContattoItem.class);
        ContattoItem contattoItem1 = getContattoItemSample1();
        ContattoItem contattoItem2 = new ContattoItem();
        assertThat(contattoItem1).isNotEqualTo(contattoItem2);

        contattoItem2.setId(contattoItem1.getId());
        assertThat(contattoItem1).isEqualTo(contattoItem2);

        contattoItem2 = getContattoItemSample2();
        assertThat(contattoItem1).isNotEqualTo(contattoItem2);
    }

    @Test
    void listaTest() {
        ContattoItem contattoItem = getContattoItemRandomSampleGenerator();
        ListaContatti listaContattiBack = getListaContattiRandomSampleGenerator();

        contattoItem.setLista(listaContattiBack);
        assertThat(contattoItem.getLista()).isEqualTo(listaContattiBack);

        contattoItem.lista(null);
        assertThat(contattoItem.getLista()).isNull();
    }
}
