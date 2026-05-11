package main.domain;

import static main.domain.ContattoItemTestSamples.*;
import static main.domain.ListaContattiTestSamples.*;
import static main.domain.MenuTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import java.util.HashSet;
import java.util.Set;
import main.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ListaContattiTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ListaContatti.class);
        ListaContatti listaContatti1 = getListaContattiSample1();
        ListaContatti listaContatti2 = new ListaContatti();
        assertThat(listaContatti1).isNotEqualTo(listaContatti2);

        listaContatti2.setId(listaContatti1.getId());
        assertThat(listaContatti1).isEqualTo(listaContatti2);

        listaContatti2 = getListaContattiSample2();
        assertThat(listaContatti1).isNotEqualTo(listaContatti2);
    }

    @Test
    void contattiTest() {
        ListaContatti listaContatti = getListaContattiRandomSampleGenerator();
        ContattoItem contattoItemBack = getContattoItemRandomSampleGenerator();

        listaContatti.addContatti(contattoItemBack);
        assertThat(listaContatti.getContattis()).containsOnly(contattoItemBack);
        assertThat(contattoItemBack.getLista()).isEqualTo(listaContatti);

        listaContatti.removeContatti(contattoItemBack);
        assertThat(listaContatti.getContattis()).doesNotContain(contattoItemBack);
        assertThat(contattoItemBack.getLista()).isNull();

        listaContatti.contattis(new HashSet<>(Set.of(contattoItemBack)));
        assertThat(listaContatti.getContattis()).containsOnly(contattoItemBack);
        assertThat(contattoItemBack.getLista()).isEqualTo(listaContatti);

        listaContatti.setContattis(new HashSet<>());
        assertThat(listaContatti.getContattis()).doesNotContain(contattoItemBack);
        assertThat(contattoItemBack.getLista()).isNull();
    }

    @Test
    void menuTest() {
        ListaContatti listaContatti = getListaContattiRandomSampleGenerator();
        Menu menuBack = getMenuRandomSampleGenerator();

        listaContatti.setMenu(menuBack);
        assertThat(listaContatti.getMenu()).isEqualTo(menuBack);
        assertThat(menuBack.getContatti()).isEqualTo(listaContatti);

        listaContatti.menu(null);
        assertThat(listaContatti.getMenu()).isNull();
        assertThat(menuBack.getContatti()).isNull();
    }
}
