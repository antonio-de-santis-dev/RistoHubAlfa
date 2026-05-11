package main.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import main.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ListaContattiDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ListaContattiDTO.class);
        ListaContattiDTO listaContattiDTO1 = new ListaContattiDTO();
        listaContattiDTO1.setId(1L);
        ListaContattiDTO listaContattiDTO2 = new ListaContattiDTO();
        assertThat(listaContattiDTO1).isNotEqualTo(listaContattiDTO2);
        listaContattiDTO2.setId(listaContattiDTO1.getId());
        assertThat(listaContattiDTO1).isEqualTo(listaContattiDTO2);
        listaContattiDTO2.setId(2L);
        assertThat(listaContattiDTO1).isNotEqualTo(listaContattiDTO2);
        listaContattiDTO1.setId(null);
        assertThat(listaContattiDTO1).isNotEqualTo(listaContattiDTO2);
    }
}
