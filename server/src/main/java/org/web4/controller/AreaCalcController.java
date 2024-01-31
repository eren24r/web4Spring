package org.web4.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.web4.dto.CalcResDTO;
import org.web4.dto.UserDTO;
import org.web4.entity.Area;
import org.web4.entity.User;
import org.web4.facade.AreaFacade;
import org.web4.facade.UserFacade;
import org.web4.load.response.MessageResponse;
import org.web4.services.AreaService;
import org.web4.services.UserService;
import org.web4.utils.AreaChecker;
import org.web4.vallidation.ResponseErrorValidator;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/web4/calc")
@CrossOrigin("http://localhost:4200/")
public class AreaCalcController {
    @Autowired
    private UserService userService;
    @Autowired
    private AreaService areaService;
    @Autowired
    private AreaFacade areaFacade;
    @Autowired
    private ResponseErrorValidator responseErrorValidator;

    public static final Logger LOG = LoggerFactory.getLogger(AreaCalcController.class);

    @GetMapping("/calc{x}{y}{r}")
    public ResponseEntity<CalcResDTO> getUserProfile(@RequestParam(name = "x", defaultValue = "0") Double x,
                                                     @RequestParam(name = "y", defaultValue = "0") Double y,
                                                     @RequestParam(name = "r", defaultValue = "0") Double r,
                                                     Principal principal){
        User user = userService.getCurrentUser(principal);

        Area res = AreaChecker.getAllRes(x, y, r);
        res.setUserid(user.getId());

        CalcResDTO calcResDTO = areaFacade.areaToAreaDTO(res);

        areaService.saveArea(res);

        return new ResponseEntity<>(calcResDTO, HttpStatus.OK);
    }

    @GetMapping("/getalldata")
    public ResponseEntity<List<CalcResDTO>> getAllDataFromUser(Principal principal) {
        User user = userService.getCurrentUser(principal);

        try {
            LOG.info("ID: " + user.getId());

            List<Area> areas = areaService.getAllAreaById(user.getId());

            List<CalcResDTO> lDTO = new ArrayList<>();

            for (Area area : areas) {
                LOG.info("Area " + area.getId() + " is admin " + area.getUserid());
                lDTO.add(areaFacade.areaToAreaDTO(area));
            }

            return new ResponseEntity<>(lDTO, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("error getting " + e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<MessageResponse> clearAllAreaOfUser(Principal principal) {
        User user = userService.getCurrentUser(principal);

        try {
            LOG.info("Deleting Area of ID: " + user.getId());

            areaService.deleteAll(user.getId());

            return new ResponseEntity<>(new MessageResponse("Successfully deleted!"), HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("error deleting " + e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

}
