package com.springboot.simplyfly.repository;

import com.springboot.simplyfly.model.Seat;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

//import java.lang.ScopedValue;
import java.util.List;
import java.util.Optional;

//import java.lang.ScopedValue;

@Repository
public interface SeatRepository extends JpaRepository<Seat,Integer> {
    @Query("""
            select s from Seat s where s.flight.flightId = ?1 and s.seatNumber = ?2
            """)
    Optional<Seat> fetchById(Integer flightId,String seatNo);

    List<Seat> findByFlight_FlightId(Integer id);

    Optional<Seat> findByFlight_FlightIdAndSeatNumber(Integer flightId,String seatNumber);
    @Query("""
            select s from Seat s where s.flight.flightId=?1 and s.seatNumber in ?2
            """)
    List<Seat> findMultipleSeats(Integer flightId, List<String> seatNumbers);
}
