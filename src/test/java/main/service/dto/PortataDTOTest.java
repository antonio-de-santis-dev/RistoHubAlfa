package main.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import main.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PortataDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(PortataDTO.class);
        PortataDTO portataDTO1 = new PortataDTO();
        portataDTO1.setId(1L);
        PortataDTO portataDTO2 = new PortataDTO();
        assertThat(portataDTO1).isNotEqualTo(portataDTO2);
        portataDTO2.setId(portataDTO1.getId());
        assertThat(portataDTO1).isEqualTo(portataDTO2);
        portataDTO2.setId(2L);
        assertThat(portataDTO1).isNotEqualTo(portataDTO2);
        portataDTO1.setId(null);
        assertThat(portataDTO1).isNotEqualTo(portataDTO2);
    }
}
