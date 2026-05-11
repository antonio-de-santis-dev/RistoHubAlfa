package main.service.mapper;

import main.domain.ProfiloRistoratore;
import main.domain.User;
import main.service.dto.ProfiloRistoratoreDTO;
import main.service.dto.UserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ProfiloRistoratore} and its DTO {@link ProfiloRistoratoreDTO}.
 */
@Mapper(componentModel = "spring")
public interface ProfiloRistoratoreMapper extends EntityMapper<ProfiloRistoratoreDTO, ProfiloRistoratore> {
    @Mapping(target = "user", source = "user", qualifiedByName = "userLogin")
    ProfiloRistoratoreDTO toDto(ProfiloRistoratore s);

    @Named("userLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    UserDTO toDtoUserLogin(User user);
}
