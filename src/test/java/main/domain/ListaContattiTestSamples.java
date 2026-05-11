package main.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ListaContattiTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static ListaContatti getListaContattiSample1() {
        return new ListaContatti().id(1L).note("note1");
    }

    public static ListaContatti getListaContattiSample2() {
        return new ListaContatti().id(2L).note("note2");
    }

    public static ListaContatti getListaContattiRandomSampleGenerator() {
        return new ListaContatti().id(longCount.incrementAndGet()).note(UUID.randomUUID().toString());
    }
}
