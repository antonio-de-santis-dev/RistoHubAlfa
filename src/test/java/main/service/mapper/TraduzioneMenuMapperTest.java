package main.service.mapper;

import static main.domain.TraduzioneMenuAsserts.*;
import static main.domain.TraduzioneMenuTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class TraduzioneMenuMapperTest {

    private TraduzioneMenuMapper traduzioneMenuMapper;

    @BeforeEach
    void setUp() {
        traduzioneMenuMapper = new TraduzioneMenuMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getTraduzioneMenuSample1();
        var actual = traduzioneMenuMapper.toEntity(traduzioneMenuMapper.toDto(expected));
        assertTraduzioneMenuAllPropertiesEquals(expected, actual);
    }
}
