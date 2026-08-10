package com.springboot.simplyfly.repository;

import com.springboot.simplyfly.dto.response.FlightSearchRespDto;
import com.springboot.simplyfly.model.Flight;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

public interface SearchRepository extends JpaRepository<Flight,Integer> {

    @Query("""
    SELECT f
    FROM Flight f
    WHERE LOWER(f.origin) = LOWER(?1)
    AND LOWER(f.destination) = LOWER(?2)
    AND FUNCTION('DATE', f.departureTime) = ?3
    AND f.status != 'CANCELLED'
    AND f.availableSeats > 0
    ORDER BY f.basePrice, f.flightId
    """)
    List<Flight> searchFlight(
           String origin,
             String destination,
             LocalDate date,
            Pageable pageable);
}
