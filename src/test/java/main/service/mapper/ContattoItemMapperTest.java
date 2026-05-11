package main.service.mapper;

import static main.domain.ContattoItemAsserts.*;
import static main.domain.ContattoItemTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ContattoItemMapperTest {

    private ContattoItemMapper contattoItemMapper;

    @BeforeEach
    void setUp() {
        contattoItemMapper = new ContattoItemMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getContattoItemSample1();
        var actual = contattoItemMapper.toEntity(contattoItemMapper.toDto(expected));
        assertContattoItemAllPropertiesEquals(expected, actual);
    }
}
