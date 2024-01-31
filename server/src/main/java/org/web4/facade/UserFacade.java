package org.web4.facade;

import org.springframework.stereotype.Component;
import org.web4.dto.*;
import org.web4.entity.User;

@Component
public class UserFacade {
    public UserDTO userToUserDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        return userDTO;
    }

}
