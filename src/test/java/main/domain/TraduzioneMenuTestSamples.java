package main.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class TraduzioneMenuTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static TraduzioneMenu getTraduzioneMenuSample1() {
        return new TraduzioneMenu().id(1L).lingua("lingua1");
    }

    public static TraduzioneMenu getTraduzioneMenuSample2() {
        return new TraduzioneMenu().id(2L).lingua("lingua2");
    }

    public static TraduzioneMenu getTraduzioneMenuRandomSampleGenerator() {
        return new TraduzioneMenu().id(longCount.incrementAndGet()).lingua(UUID.randomUUID().toString());
    }
}
