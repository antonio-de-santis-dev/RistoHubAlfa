package main.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class ProfiloRistoratoreTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static ProfiloRistoratore getProfiloRistoratoreSample1() {
        return new ProfiloRistoratore().id(1L);
    }

    public static ProfiloRistoratore getProfiloRistoratoreSample2() {
        return new ProfiloRistoratore().id(2L);
    }

    public static ProfiloRistoratore getProfiloRistoratoreRandomSampleGenerator() {
        return new ProfiloRistoratore().id(longCount.incrementAndGet());
    }
}
