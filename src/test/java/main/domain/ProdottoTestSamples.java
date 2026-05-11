package main.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ProdottoTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Prodotto getProdottoSample1() {
        return new Prodotto().id(1L).nome("nome1").descrizione("descrizione1");
    }

    public static Prodotto getProdottoSample2() {
        return new Prodotto().id(2L).nome("nome2").descrizione("descrizione2");
    }

    public static Prodotto getProdottoRandomSampleGenerator() {
        return new Prodotto().id(longCount.incrementAndGet()).nome(UUID.randomUUID().toString()).descrizione(UUID.randomUUID().toString());
    }
}
