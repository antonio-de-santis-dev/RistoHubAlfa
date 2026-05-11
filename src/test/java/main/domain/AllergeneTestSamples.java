package main.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class AllergeneTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Allergene getAllergeneSample1() {
        return new Allergene().id(1L).nome("nome1");
    }

    public static Allergene getAllergeneSample2() {
        return new Allergene().id(2L).nome("nome2");
    }

    public static Allergene getAllergeneRandomSampleGenerator() {
        return new Allergene().id(longCount.incrementAndGet()).nome(UUID.randomUUID().toString());
    }
}
