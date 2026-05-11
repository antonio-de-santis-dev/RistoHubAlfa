package main.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class MenuTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Menu getMenuSample1() {
        return new Menu().id(1L).nome("nome1").descrizione("descrizione1").logoNome("logoNome1");
    }

    public static Menu getMenuSample2() {
        return new Menu().id(2L).nome("nome2").descrizione("descrizione2").logoNome("logoNome2");
    }

    public static Menu getMenuRandomSampleGenerator() {
        return new Menu()
            .id(longCount.incrementAndGet())
            .nome(UUID.randomUUID().toString())
            .descrizione(UUID.randomUUID().toString())
            .logoNome(UUID.randomUUID().toString());
    }
}
