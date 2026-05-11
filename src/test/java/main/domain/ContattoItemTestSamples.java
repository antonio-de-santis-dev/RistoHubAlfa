package main.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class ContattoItemTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static ContattoItem getContattoItemSample1() {
        return new ContattoItem().id(1L).valore("valore1").etichetta("etichetta1").ordine(1);
    }

    public static ContattoItem getContattoItemSample2() {
        return new ContattoItem().id(2L).valore("valore2").etichetta("etichetta2").ordine(2);
    }

    public static ContattoItem getContattoItemRandomSampleGenerator() {
        return new ContattoItem()
            .id(longCount.incrementAndGet())
            .valore(UUID.randomUUID().toString())
            .etichetta(UUID.randomUUID().toString())
            .ordine(intCount.incrementAndGet());
    }
}
