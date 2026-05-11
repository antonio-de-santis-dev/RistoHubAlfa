package main.domain;

import static main.domain.MenuTestSamples.*;
import static main.domain.TraduzioneMenuTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import main.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TraduzioneMenuTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TraduzioneMenu.class);
        TraduzioneMenu traduzioneMenu1 = getTraduzioneMenuSample1();
        TraduzioneMenu traduzioneMenu2 = new TraduzioneMenu();
        assertThat(traduzioneMenu1).isNotEqualTo(traduzioneMenu2);

        traduzioneMenu2.setId(traduzioneMenu1.getId());
        assertThat(traduzioneMenu1).isEqualTo(traduzioneMenu2);

        traduzioneMenu2 = getTraduzioneMenuSample2();
        assertThat(traduzioneMenu1).isNotEqualTo(traduzioneMenu2);
    }

    @Test
    void menuTest() {
        TraduzioneMenu traduzioneMenu = getTraduzioneMenuRandomSampleGenerator();
        Menu menuBack = getMenuRandomSampleGenerator();

        traduzioneMenu.setMenu(menuBack);
        assertThat(traduzioneMenu.getMenu()).isEqualTo(menuBack);

        traduzioneMenu.menu(null);
        assertThat(traduzioneMenu.getMenu()).isNull();
    }
}
