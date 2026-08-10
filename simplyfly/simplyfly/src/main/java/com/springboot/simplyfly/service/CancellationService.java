package com.springboot.simplyfly.service;

import com.springboot.simplyfly.dto.request.CancellationReqDto;
import com.springboot.simplyfly.enums.*;
import com.springboot.simplyfly.model.*;
import com.springboot.simplyfly.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CancellationService {

    private final BookingRepository bookingRepository;
    private final PassengerRepository passengerRepository;
    private final PaymentRepository paymentRepository;
    private final FlightRepository flightRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;

    @Transactional
    public String cancelTicket(CancellationReqDto cancellationReqDto, String userName) {

        Booking booking=bookingRepository.findById(cancellationReqDto.bookingId()).orElseThrow(()->
                new RuntimeException("Booking not Found!"));

        User user=userRepository.findByEmailAndIsActiveTrue(userName).orElseThrow(()
                ->new RuntimeException("User not found!"));

        if(!booking.getUser().getUserId().equals(user.getUserId())){
            throw new RuntimeException("You can only cancel your bookings.");

        }

        Flight flight=booking.getFlight();

        long timeRem = Duration.between(LocalDateTime.now(), flight.getDepartureTime()).toHours();
        boolean isEligibleForRefund = timeRem >= 24;

        int cancelCount = 0;
        BigDecimal totalRefund = BigDecimal.ZERO;

        List<Passenger> passengers = passengerRepository.findByBooking_BookingId(booking.getBookingId());

        for (Passenger passenger : passengers) {
            if (cancellationReqDto.passengerId().contains(passenger.getPassengerId())
                    && passenger.getStatus() == PassengerStatus.ACTIVE) {

                // Cancel passenger
                passenger.setStatus(PassengerStatus.CANCELLED);

                // Free the seat
                Seat seat = passenger.getSeat();
                seat.setStatus(SeatStatus.AVAILABLE);
                seatRepository.save(seat);

                // DYNAMIC REFUND LOGIC
                BigDecimal seatPrice = flight.getBasePrice();
                if (seat.getSeatClass() == SeatClass.BUSINESS) {
                    seatPrice = seatPrice.multiply(BigDecimal.valueOf(3)); // Business class cost 3x
                }

                if (isEligibleForRefund) {
                    // Refund 70% of what THIS specific seat cost
                    BigDecimal refundForThisSeat = seatPrice.multiply(BigDecimal.valueOf(0.70));
                    totalRefund = totalRefund.add(refundForThisSeat);
                }

                cancelCount++;
            }
        }

        if(cancelCount == 0) {
            throw new RuntimeException("No active passengers to cancel.");
        }

        flight.setAvailableSeats(flight.getAvailableSeats() + cancelCount);
        flightRepository.save(flight);


        Payment payment = paymentRepository.findByBooking_BookingId(booking.getBookingId())
                .orElseThrow(() -> new RuntimeException("Payment record not found"));

        payment.setRefundedAmount(payment.getRefundedAmount().add(totalRefund));

        boolean allCancelled = passengers.stream()
                .allMatch(p -> p.getStatus() == PassengerStatus.CANCELLED);

        if(allCancelled){
            booking.setBookingStatus(BookingStatus.CANCELLED);
            payment.setPaymentStatus(PaymentStatus.REFUNDED);
        }

        passengerRepository.saveAll(passengers);
        bookingRepository.save(booking);
        paymentRepository.save(payment);

        return String.format("Successfully cancelled %d ticket(s). Refund amount: ₹%.2f",
                cancelCount, totalRefund);
    }
}
