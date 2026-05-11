package main.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import main.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AllergeneDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(AllergeneDTO.class);
        AllergeneDTO allergeneDTO1 = new AllergeneDTO();
        allergeneDTO1.setId(1L);
        AllergeneDTO allergeneDTO2 = new AllergeneDTO();
        assertThat(allergeneDTO1).isNotEqualTo(allergeneDTO2);
        allergeneDTO2.setId(allergeneDTO1.getId());
        assertThat(allergeneDTO1).isEqualTo(allergeneDTO2);
        allergeneDTO2.setId(2L);
        assertThat(allergeneDTO1).isNotEqualTo(allergeneDTO2);
        allergeneDTO1.setId(null);
        assertThat(allergeneDTO1).isNotEqualTo(allergeneDTO2);
    }
}
