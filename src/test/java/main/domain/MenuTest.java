package main.domain;

import static main.domain.ListaContattiTestSamples.*;
import static main.domain.MenuTestSamples.*;
import static main.domain.PortataTestSamples.*;
import static main.domain.TraduzioneMenuTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import java.util.HashSet;
import java.util.Set;
import main.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MenuTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Menu.class);
        Menu menu1 = getMenuSample1();
        Menu menu2 = new Menu();
        assertThat(menu1).isNotEqualTo(menu2);

        menu2.setId(menu1.getId());
        assertThat(menu1).isEqualTo(menu2);

        menu2 = getMenuSample2();
        assertThat(menu1).isNotEqualTo(menu2);
    }

    @Test
    void contattiTest() {
        Menu menu = getMenuRandomSampleGenerator();
        ListaContatti listaContattiBack = getListaContattiRandomSampleGenerator();

        menu.setContatti(listaContattiBack);
        assertThat(menu.getContatti()).isEqualTo(listaContattiBack);

        menu.contatti(null);
        assertThat(menu.getContatti()).isNull();
    }

    @Test
    void portateTest() {
        Menu menu = getMenuRandomSampleGenerator();
        Portata portataBack = getPortataRandomSampleGenerator();

        menu.addPortate(portataBack);
        assertThat(menu.getPortates()).containsOnly(portataBack);
        assertThat(portataBack.getMenu()).isEqualTo(menu);

        menu.removePortate(portataBack);
        assertThat(menu.getPortates()).doesNotContain(portataBack);
        assertThat(portataBack.getMenu()).isNull();

        menu.portates(new HashSet<>(Set.of(portataBack)));
        assertThat(menu.getPortates()).containsOnly(portataBack);
        assertThat(portataBack.getMenu()).isEqualTo(menu);

        menu.setPortates(new HashSet<>());
        assertThat(menu.getPortates()).doesNotContain(portataBack);
        assertThat(portataBack.getMenu()).isNull();
    }

    @Test
    void traduzioniTest() {
        Menu menu = getMenuRandomSampleGenerator();
        TraduzioneMenu traduzioneMenuBack = getTraduzioneMenuRandomSampleGenerator();

        menu.addTraduzioni(traduzioneMenuBack);
        assertThat(menu.getTraduzionis()).containsOnly(traduzioneMenuBack);
        assertThat(traduzioneMenuBack.getMenu()).isEqualTo(menu);

        menu.removeTraduzioni(traduzioneMenuBack);
        assertThat(menu.getTraduzionis()).doesNotContain(traduzioneMenuBack);
        assertThat(traduzioneMenuBack.getMenu()).isNull();

        menu.traduzionis(new HashSet<>(Set.of(traduzioneMenuBack)));
        assertThat(menu.getTraduzionis()).containsOnly(traduzioneMenuBack);
        assertThat(traduzioneMenuBack.getMenu()).isEqualTo(menu);

        menu.setTraduzionis(new HashSet<>());
        assertThat(menu.getTraduzionis()).doesNotContain(traduzioneMenuBack);
        assertThat(traduzioneMenuBack.getMenu()).isNull();
    }
}
