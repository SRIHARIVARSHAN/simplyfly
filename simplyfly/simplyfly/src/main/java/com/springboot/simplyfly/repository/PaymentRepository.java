package com.springboot.simplyfly.repository;

import com.springboot.simplyfly.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment,Long> {
    Optional<Payment> findByBooking_BookingId(Integer bookingId);
}
