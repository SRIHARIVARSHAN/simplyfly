package com.springboot.simplyfly.repository;

import com.springboot.simplyfly.enums.PassengerStatus;
import com.springboot.simplyfly.model.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PassengerRepository extends JpaRepository<Passenger,Integer> {

    List<Passenger> findByBooking_BookingId(Integer bookingId);

    @Query("""
            select p from Passenger p where p.seat.seatId=?1 and p.status=?2
            
            """)
    Optional<Passenger> findBySeatAndStatus(Integer seatId, PassengerStatus passengerStatus);

    @Query("""
            select p from Passenger p join p.booking b
            join b.flight f
            where f.flightId=?1
            """)

    List<Passenger> findPassengersForFlight(Integer flightId);
}
