package com.springboot.simplyfly.service;

import com.springboot.simplyfly.dto.request.BookingReqDto;
import com.springboot.simplyfly.dto.request.CoPassengerReqDto;
import com.springboot.simplyfly.dto.response.BookingHistoryDto;
import com.springboot.simplyfly.dto.response.PassengerHistoryDto;
import com.springboot.simplyfly.enums.*;
import com.springboot.simplyfly.model.*;
import com.springboot.simplyfly.repository.*;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final SeatRepository seatRepository;
    private final FlightRepository flightRepository;
    private final PaymentRepository paymentRepository;
    private final PassengerRepository passengerRepository;

    @Transactional
    public String addBooking(@Valid BookingReqDto bookingReqDto,String userName) {
        //fetch user
        User user = userRepository.findByEmailAndIsActiveTrue(userName)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        //fetch flight
        Flight flight = flightRepository.findById(bookingReqDto.flightId())
                .orElseThrow(() -> new RuntimeException("Flight not found!"));

        //check seats
        int requestedSeats = bookingReqDto.coPassengers().size();
        if (flight.getAvailableSeats() < requestedSeats) {
            throw new RuntimeException(requestedSeats+ " seat(s) are not available on this flight! Try Later");
        }

        //Price
        BigDecimal totalPrice = BigDecimal.ZERO;
        List<Seat> validatedSeats = new ArrayList<>(); // Store them so we don't have to query DB twice

        for (CoPassengerReqDto cpDto : bookingReqDto.coPassengers()) {

            // Find seat by Flight ID and Seat Number (e.g., Flight 6, Seat "11A")
            Seat seat = seatRepository.findByFlight_FlightIdAndSeatNumber(flight.getFlightId(), cpDto.seatNumber())
                    .orElseThrow(() -> new RuntimeException("Seat " + cpDto.seatNumber() + " not found on this flight!"));

            if (seat.getStatus() != SeatStatus.AVAILABLE) {
                throw new RuntimeException("Seat " + seat.getSeatNumber() + " is already booked or locked.");
            }

            // DYNAMIC PRICING LOGIC
            BigDecimal currentSeatPrice = flight.getBasePrice();
            if (seat.getSeatClass() == SeatClass.BUSINESS) {
                // If Business Class, multiply base price by 3
                currentSeatPrice = currentSeatPrice.multiply(BigDecimal.valueOf(3));
            }

            totalPrice = totalPrice.add(currentSeatPrice);
            validatedSeats.add(seat);
        }
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setFlight(flight);
        booking.setBookingDate(LocalDateTime.now());
        booking.setTotalAmount(totalPrice);
        booking.setBookingStatus(BookingStatus.CONFIRMED);
        Booking savedBooking=bookingRepository.save(booking);

        List<Passenger> passengerList=new ArrayList<>();

        for(int i = 0; i < bookingReqDto.coPassengers().size(); i++){
            CoPassengerReqDto cpDto = bookingReqDto.coPassengers().get(i);
            Seat seat = validatedSeats.get(i); // Fetch the pre-validated seat

            // Lock in the seat
            seat.setStatus(SeatStatus.BOOKED);

            // Create Passenger
            Passenger passenger = new Passenger();
            passenger.setBooking(savedBooking);
            passenger.setSeat(seat);
            passenger.setPassengerName(cpDto.passengerName());
            passenger.setAge(cpDto.age());
            passenger.setGender(cpDto.gender());
            passenger.setStatus(PassengerStatus.ACTIVE);

            String eTicket = "SMY-TKT_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            passenger.setETicketNumber(eTicket);

            passengerList.add(passenger);

        }

        seatRepository.saveAll(validatedSeats);
        passengerRepository.saveAll(passengerList);

        flight.setAvailableSeats(flight.getAvailableSeats() - requestedSeats);
        flightRepository.save(flight);

        Payment payment = new Payment();
        payment.setBooking(savedBooking);
        payment.setAmountPaid(totalPrice);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentMethod(bookingReqDto.paymentMethod());
        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        paymentRepository.save(payment);

        return "Booking successful! Your Booking ID is: " + savedBooking.getBookingId();
    }

    public List<BookingHistoryDto> getBookingHistory(String email) {
        List<Booking> bookings = bookingRepository.findByUser_EmailOrderByBookingDateDesc(email);

        List<BookingHistoryDto> bookingList = new ArrayList<>();

        for(Booking booking: bookings){
            Flight flight=booking.getFlight();

            List<Passenger> passengers = passengerRepository.findByBooking_BookingId(booking.getBookingId());
            List<PassengerHistoryDto> passengerHistoryDtos = new ArrayList<>();

            for(Passenger p: passengers){
                PassengerHistoryDto phDto = new PassengerHistoryDto(
                        p.getPassengerId(),
                        p.getPassengerName(),
                        p.getAge(),
                        p.getGender(),
                        p.getETicketNumber(),
                        p.getSeat().getSeatNumber(),
                        p.getSeat().getSeatClass().toString(),
                        p.getStatus().toString()

                );
                passengerHistoryDtos.add(phDto);
            }

            Payment payment = paymentRepository.findByBooking_BookingId(booking.getBookingId())
                    .orElseThrow(()->new RuntimeException("payment is missing for booking id "+booking.getBookingId()));

            BookingHistoryDto fullDto = new BookingHistoryDto(
                    booking.getBookingId(),
                    booking.getBookingDate(),
                    booking.getBookingStatus().toString(),
                    booking.getTotalAmount(),

                    flight.getFlightNumber(),
                    flight.getOrigin(),
                    flight.getDestination(),
                    flight.getDepartureTime(),
                    flight.getArrivalTime(),

                    payment.getPaymentMethod(),
                    payment.getPaymentStatus().toString(),
                    payment.getRefundedAmount(),

                    passengerHistoryDtos
            );

            bookingList.add(fullDto);
        }

        return bookingList;

    }
}
