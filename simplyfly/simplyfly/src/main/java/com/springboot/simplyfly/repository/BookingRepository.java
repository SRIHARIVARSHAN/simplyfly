package com.springboot.simplyfly.repository;

import com.springboot.simplyfly.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking,Integer> {

    List<Booking> findByFlight_FlightId(Integer flightId);

    List<Booking> findByUser_EmailOrderByBookingDateDesc(String email);
}
