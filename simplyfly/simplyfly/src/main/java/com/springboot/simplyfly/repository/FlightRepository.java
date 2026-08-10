package com.springboot.simplyfly.repository;

import com.springboot.simplyfly.dto.response.FlightByCompanyRespDto;
import com.springboot.simplyfly.model.Flight;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

//import java.lang.ScopedValue;
import java.util.List;
import java.util.Optional;

public interface FlightRepository extends JpaRepository<Flight,Integer> {

    @Query("""
            select
            f.owner.companyName,
                f.flightNumber,
                f.origin,
                f.destination,
                f.status,
                f.totalCapacity AS totalSeats,
                f.availableSeats AS availableSeats,
                f.departureTime,
                f.arrivalTime
            FROM Flight f
            WHERE f.owner.companyName = ?1 and f.status != 'CANCELLED'
            """)
    List<FlightByCompanyRespDto> getFlightByCompany(String companyName, Pageable pageable);


    @Query("""
        select f from Flight f where f.id=?1 and f.status != 'CANCELLED'
        """)
    Optional<Flight> fetchById(Integer id);

    @Query("""
            select f from Flight f join f.owner o where o.email=?1
            """)
    List<Flight> getFlightDetails(String email);


}
