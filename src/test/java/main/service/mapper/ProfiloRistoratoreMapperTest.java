package main.service.mapper;

import static main.domain.ProfiloRistoratoreAsserts.*;
import static main.domain.ProfiloRistoratoreTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ProfiloRistoratoreMapperTest {

    private ProfiloRistoratoreMapper profiloRistoratoreMapper;

    @BeforeEach
    void setUp() {
        profiloRistoratoreMapper = new ProfiloRistoratoreMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getProfiloRistoratoreSample1();
        var actual = profiloRistoratoreMapper.toEntity(profiloRistoratoreMapper.toDto(expected));
        assertProfiloRistoratoreAllPropertiesEquals(expected, actual);
    }
}
