package main.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import main.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProfiloRistoratoreDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProfiloRistoratoreDTO.class);
        ProfiloRistoratoreDTO profiloRistoratoreDTO1 = new ProfiloRistoratoreDTO();
        profiloRistoratoreDTO1.setId(1L);
        ProfiloRistoratoreDTO profiloRistoratoreDTO2 = new ProfiloRistoratoreDTO();
        assertThat(profiloRistoratoreDTO1).isNotEqualTo(profiloRistoratoreDTO2);
        profiloRistoratoreDTO2.setId(profiloRistoratoreDTO1.getId());
        assertThat(profiloRistoratoreDTO1).isEqualTo(profiloRistoratoreDTO2);
        profiloRistoratoreDTO2.setId(2L);
        assertThat(profiloRistoratoreDTO1).isNotEqualTo(profiloRistoratoreDTO2);
        profiloRistoratoreDTO1.setId(null);
        assertThat(profiloRistoratoreDTO1).isNotEqualTo(profiloRistoratoreDTO2);
    }
}
