package org.web4.facade;

import org.springframework.stereotype.Component;
import org.web4.dto.CalcResDTO;
import org.web4.dto.UserDTO;
import org.web4.entity.Area;
import org.web4.entity.User;

@Component
public class AreaFacade {
    public CalcResDTO areaToAreaDTO(Area area) {
        CalcResDTO calcResDTO = new CalcResDTO();
        calcResDTO.setX(area.getX());
        calcResDTO.setY(area.getY());
        calcResDTO.setR(area.getR());
        calcResDTO.setRes(area.isRes());
        calcResDTO.setCalculationTime(area.getCalculationTime());
        calcResDTO.setCalculatedAt(area.getCalculatedAt());

        return calcResDTO;
    }

}
