package main.domain;

import static main.domain.AllergeneTestSamples.*;
import static main.domain.ProdottoTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import java.util.HashSet;
import java.util.Set;
import main.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AllergeneTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Allergene.class);
        Allergene allergene1 = getAllergeneSample1();
        Allergene allergene2 = new Allergene();
        assertThat(allergene1).isNotEqualTo(allergene2);

        allergene2.setId(allergene1.getId());
        assertThat(allergene1).isEqualTo(allergene2);

        allergene2 = getAllergeneSample2();
        assertThat(allergene1).isNotEqualTo(allergene2);
    }

    @Test
    void prodottiTest() {
        Allergene allergene = getAllergeneRandomSampleGenerator();
        Prodotto prodottoBack = getProdottoRandomSampleGenerator();

        allergene.addProdotti(prodottoBack);
        assertThat(allergene.getProdottis()).containsOnly(prodottoBack);
        assertThat(prodottoBack.getAllergenis()).containsOnly(allergene);

        allergene.removeProdotti(prodottoBack);
        assertThat(allergene.getProdottis()).doesNotContain(prodottoBack);
        assertThat(prodottoBack.getAllergenis()).doesNotContain(allergene);

        allergene.prodottis(new HashSet<>(Set.of(prodottoBack)));
        assertThat(allergene.getProdottis()).containsOnly(prodottoBack);
        assertThat(prodottoBack.getAllergenis()).containsOnly(allergene);

        allergene.setProdottis(new HashSet<>());
        assertThat(allergene.getProdottis()).doesNotContain(prodottoBack);
        assertThat(prodottoBack.getAllergenis()).doesNotContain(allergene);
    }
}
