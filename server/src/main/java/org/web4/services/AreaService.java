package org.web4.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.web4.entity.Area;
import org.web4.execption.UserExistException;
import org.web4.reps.AreaRep;
import org.web4.reps.UserRep;

import java.util.List;
import java.util.Optional;

@Service
public class AreaService {
    public static final Logger LOG = LoggerFactory.getLogger(AreaService.class);
    private final AreaRep areaRep;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public AreaService(AreaRep areaRep, BCryptPasswordEncoder passwordEncoder) {
        this.areaRep = areaRep;
        this.passwordEncoder = passwordEncoder;
    }

    public Area saveArea(Area area){
        try {
            LOG.info("Saving Area {}", area.getId());
            return areaRep.save(area);
        } catch (Exception exception){
            LOG.error("Error in reg : {}", exception.getMessage());
            throw new UserExistException("The area " + area.getId() + " already exist.");
        }
    }

    public List<Area> getAllAreaById(Long id){
        try {
            return areaRep.findAllByUserid(id);
        }catch (Exception e){
            throw new UserExistException("The Areas not found! " + e.getMessage());
        }
    }

    @Transactional
    public void deleteAll(Long id){
        try {
            areaRep.deleteAllByUserid(id);
        }catch (Exception e){
            throw new UserExistException("The Areas not deleting! " + e.getMessage());
        }
    }

    /* User updateUser(UserDTO userDTO, Principal principal) {
        User user = getUserByPrincipal(principal);
        user.setUsername(userDTO.getUsername());

        return userRep.save(user);
    }

    public User getCurrentUser(Principal principal) {
        return getUserByPrincipal(principal);
    }

    private User getUserByPrincipal(Principal principal) {
        String username = principal.getName();
        return userRep.findUserByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username not found with username " + username));
    }

    public User getUserById(Long id) {
        return userRep.findById(id).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }*/
}
