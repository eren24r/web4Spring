package org.web4.reps;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.web4.entity.Area;

import java.util.List;
import java.util.Optional;

@Repository
public interface AreaRep extends JpaRepository<Area, Long> {

    List<Area> findAllByUserid(Long id);
    void deleteAllByUserid(Long id);
    Optional<Area> findAreaById(Long id);
}
