package main.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import main.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PiattoDelGiornoDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(PiattoDelGiornoDTO.class);
        PiattoDelGiornoDTO piattoDelGiornoDTO1 = new PiattoDelGiornoDTO();
        piattoDelGiornoDTO1.setId(1L);
        PiattoDelGiornoDTO piattoDelGiornoDTO2 = new PiattoDelGiornoDTO();
        assertThat(piattoDelGiornoDTO1).isNotEqualTo(piattoDelGiornoDTO2);
        piattoDelGiornoDTO2.setId(piattoDelGiornoDTO1.getId());
        assertThat(piattoDelGiornoDTO1).isEqualTo(piattoDelGiornoDTO2);
        piattoDelGiornoDTO2.setId(2L);
        assertThat(piattoDelGiornoDTO1).isNotEqualTo(piattoDelGiornoDTO2);
        piattoDelGiornoDTO1.setId(null);
        assertThat(piattoDelGiornoDTO1).isNotEqualTo(piattoDelGiornoDTO2);
    }
}
