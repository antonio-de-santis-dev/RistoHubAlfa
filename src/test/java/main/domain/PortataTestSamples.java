package main.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class PortataTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Portata getPortataSample1() {
        return new Portata().id(1L).nomePersonalizzato("nomePersonalizzato1").ordine(1);
    }

    public static Portata getPortataSample2() {
        return new Portata().id(2L).nomePersonalizzato("nomePersonalizzato2").ordine(2);
    }

    public static Portata getPortataRandomSampleGenerator() {
        return new Portata()
            .id(longCount.incrementAndGet())
            .nomePersonalizzato(UUID.randomUUID().toString())
            .ordine(intCount.incrementAndGet());
    }
}
