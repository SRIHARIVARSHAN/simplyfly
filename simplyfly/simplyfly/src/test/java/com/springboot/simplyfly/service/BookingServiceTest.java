package com.springboot.simplyfly.service;

import com.springboot.simplyfly.dto.request.*;
import com.springboot.simplyfly.dto.response.*;
import com.springboot.simplyfly.enums.*;
import com.springboot.simplyfly.model.*;
import com.springboot.simplyfly.repository.*;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @InjectMocks BookingService bookingService;
    @Mock BookingRepository bookingRepository;
    @Mock UserRepository userRepository;
    @Mock SeatRepository seatRepository;
    @Mock FlightRepository flightRepository;
    @Mock PaymentRepository paymentRepository;
    @Mock PassengerRepository passengerRepository;

    private User user;
    private Flight flight;
    private Seat seat;

    @BeforeEach
    void init() {
        user = new User();
        user.setUserId(1);
        user.setEmail("kavin@gmail.com");
        user.setIsActive(true);

        flight = new Flight();
        flight.setFlightId(1);
        flight.setFlightNumber("SF101");
        flight.setOrigin("Chennai");
        flight.setDestination("Bangalore");
        flight.setBasePrice(BigDecimal.valueOf(5000));
        flight.setAvailableSeats(72);
        flight.setDepartureTime(LocalDateTime.now().plusDays(2));
        flight.setArrivalTime(LocalDateTime.now().plusDays(2).plusHours(1));

        seat = new Seat();
        seat.setSeatId(1);
        seat.setFlight(flight);
        seat.setSeatNumber("3A");
        seat.setSeatClass(SeatClass.ECONOMY);
        seat.setStatus(SeatStatus.AVAILABLE);
    }

    @Test
    void addBookingTest() {
        CoPassengerReqDto cp = new CoPassengerReqDto("Arun",25,"Male","3A");
        BookingReqDto dto = new BookingReqDto(1,"UPI",List.of(cp));

        Booking saved = new Booking();
        saved.setBookingId(10);

        when(userRepository.findByEmailAndIsActiveTrue(anyString())).thenReturn(Optional.of(user));
        when(flightRepository.findById(1)).thenReturn(Optional.of(flight));
        when(seatRepository.findByFlight_FlightIdAndSeatNumber(1,"3A")).thenReturn(Optional.of(seat));
        when(bookingRepository.save(any())).thenReturn(saved);

        String result = bookingService.addBooking(dto,"kavin@gmail.com");



        verify(bookingRepository).save(any());
        verify(seatRepository).saveAll(anyList());
        verify(passengerRepository).saveAll(anyList());
        verify(paymentRepository).save(any());
        verify(flightRepository).save(flight);
    }

    @Test
    void addBookingShouldThrowWhenUserNotFound() {
        when(userRepository.findByEmailAndIsActiveTrue(anyString())).thenReturn(Optional.empty());

        BookingReqDto dto = new BookingReqDto(1,"UPI",
                List.of(new CoPassengerReqDto("Arun",25,"Male","3A")));

        assertThrows(RuntimeException.class,
                () -> bookingService.addBooking(dto,"wrong@gmail.com"));

        verify(flightRepository, never()).findById(any());
    }

    @Test
    void getBookingHistoryTest() {
        Booking booking = new Booking();
        booking.setBookingId(10);
        booking.setBookingDate(LocalDateTime.now());
        booking.setBookingStatus(BookingStatus.CONFIRMED);
        booking.setTotalAmount(BigDecimal.valueOf(5000));
        booking.setFlight(flight);

        Payment payment = new Payment();
        payment.setPaymentMethod("UPI");
        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        payment.setRefundedAmount(BigDecimal.ZERO);

        Passenger passenger = new Passenger();
        passenger.setPassengerId(1);
        passenger.setPassengerName("Arun");
        passenger.setAge(25);
        passenger.setGender("Male");
        passenger.setETicketNumber("TKT123");
        passenger.setSeat(seat);
        passenger.setStatus(PassengerStatus.ACTIVE);

        when(bookingRepository.findBookingHistory("kavin@gmail.com")).thenReturn(List.of(booking));
        when(passengerRepository.findPassengerByBookingId(10)).thenReturn(List.of(passenger));
        when(paymentRepository.findPaymentByBookingId(10)).thenReturn(Optional.of(payment));

        List<BookingHistoryDto> result = bookingService.getBookingHistory("kavin@gmail.com");

        assertEquals(1, result.size());
        assertEquals("SF101", result.getFirst().flightNumber());
        assertEquals("Arun", result.getFirst().passengers().getFirst().passengerName());
        assertEquals("UPI", result.getFirst().paymentMethod());
    }

    @Test
    void getBookingHistoryShouldThrowWhenPaymentMissing() {
        Booking booking = new Booking();
        booking.setBookingId(10);
        booking.setFlight(flight);

        when(bookingRepository.findBookingHistory("kavin@gmail.com")).thenReturn(List.of(booking));
        when(passengerRepository.findPassengerByBookingId(10)).thenReturn(List.of());
        when(paymentRepository.findPaymentByBookingId(10)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> bookingService.getBookingHistory("kavin@gmail.com"));
    }
}