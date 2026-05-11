package main.service.mapper;

import static main.domain.ListaContattiAsserts.*;
import static main.domain.ListaContattiTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ListaContattiMapperTest {

    private ListaContattiMapper listaContattiMapper;

    @BeforeEach
    void setUp() {
        listaContattiMapper = new ListaContattiMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getListaContattiSample1();
        var actual = listaContattiMapper.toEntity(listaContattiMapper.toDto(expected));
        assertListaContattiAllPropertiesEquals(expected, actual);
    }
}
