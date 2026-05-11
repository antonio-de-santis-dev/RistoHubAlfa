package main.domain;

import static main.domain.ProfiloRistoratoreTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import main.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProfiloRistoratoreTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProfiloRistoratore.class);
        ProfiloRistoratore profiloRistoratore1 = getProfiloRistoratoreSample1();
        ProfiloRistoratore profiloRistoratore2 = new ProfiloRistoratore();
        assertThat(profiloRistoratore1).isNotEqualTo(profiloRistoratore2);

        profiloRistoratore2.setId(profiloRistoratore1.getId());
        assertThat(profiloRistoratore1).isEqualTo(profiloRistoratore2);

        profiloRistoratore2 = getProfiloRistoratoreSample2();
        assertThat(profiloRistoratore1).isNotEqualTo(profiloRistoratore2);
    }
}
