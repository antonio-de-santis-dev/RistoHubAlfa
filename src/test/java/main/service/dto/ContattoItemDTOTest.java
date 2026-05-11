package main.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import main.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ContattoItemDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ContattoItemDTO.class);
        ContattoItemDTO contattoItemDTO1 = new ContattoItemDTO();
        contattoItemDTO1.setId(1L);
        ContattoItemDTO contattoItemDTO2 = new ContattoItemDTO();
        assertThat(contattoItemDTO1).isNotEqualTo(contattoItemDTO2);
        contattoItemDTO2.setId(contattoItemDTO1.getId());
        assertThat(contattoItemDTO1).isEqualTo(contattoItemDTO2);
        contattoItemDTO2.setId(2L);
        assertThat(contattoItemDTO1).isNotEqualTo(contattoItemDTO2);
        contattoItemDTO1.setId(null);
        assertThat(contattoItemDTO1).isNotEqualTo(contattoItemDTO2);
    }
}
