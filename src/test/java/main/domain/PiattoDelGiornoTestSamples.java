package main.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class PiattoDelGiornoTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static PiattoDelGiorno getPiattoDelGiornoSample1() {
        return new PiattoDelGiorno().id(1L).nome("nome1").descrizione("descrizione1");
    }

    public static PiattoDelGiorno getPiattoDelGiornoSample2() {
        return new PiattoDelGiorno().id(2L).nome("nome2").descrizione("descrizione2");
    }

    public static PiattoDelGiorno getPiattoDelGiornoRandomSampleGenerator() {
        return new PiattoDelGiorno()
            .id(longCount.incrementAndGet())
            .nome(UUID.randomUUID().toString())
            .descrizione(UUID.randomUUID().toString());
    }
}
