package main.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import main.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TraduzioneMenuDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(TraduzioneMenuDTO.class);
        TraduzioneMenuDTO traduzioneMenuDTO1 = new TraduzioneMenuDTO();
        traduzioneMenuDTO1.setId(1L);
        TraduzioneMenuDTO traduzioneMenuDTO2 = new TraduzioneMenuDTO();
        assertThat(traduzioneMenuDTO1).isNotEqualTo(traduzioneMenuDTO2);
        traduzioneMenuDTO2.setId(traduzioneMenuDTO1.getId());
        assertThat(traduzioneMenuDTO1).isEqualTo(traduzioneMenuDTO2);
        traduzioneMenuDTO2.setId(2L);
        assertThat(traduzioneMenuDTO1).isNotEqualTo(traduzioneMenuDTO2);
        traduzioneMenuDTO1.setId(null);
        assertThat(traduzioneMenuDTO1).isNotEqualTo(traduzioneMenuDTO2);
    }
}
