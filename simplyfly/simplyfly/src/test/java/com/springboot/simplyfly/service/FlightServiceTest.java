package com.springboot.simplyfly.service;

import com.springboot.simplyfly.dto.request.FlightDto;
import com.springboot.simplyfly.dto.response.FlightByCompanyRespDto;
import com.springboot.simplyfly.dto.response.FlightResDto;
import com.springboot.simplyfly.dto.response.PassengerHistoryDto;
import com.springboot.simplyfly.enums.*;
import com.springboot.simplyfly.model.*;
import com.springboot.simplyfly.repository.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FlightServiceTest {

    @InjectMocks
    private FlightService flightService;

    @Mock
    private FlightRepository flightRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SeatRepository seatRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private PassengerRepository passengerRepository;

    @Mock
    private PaymentRepository paymentRepository;

    private User owner;
    private Flight flight;

    @BeforeEach
    void init() {

        owner = new User();
        owner.setUserId(1);
        owner.setName("Kavin");
        owner.setEmail("kavin@gmail.com");
        owner.setCompanyName("SimplyFly");
        owner.setIsActive(true);

        flight = new Flight();
        flight.setFlightId(1);
        flight.setOwner(owner);
        flight.setFlightNumber("SF101");
        flight.setOrigin("Chennai");
        flight.setDestination("Bangalore");
        flight.setDepartureTime(LocalDateTime.now().plusDays(5));
        flight.setArrivalTime(LocalDateTime.now().plusDays(5).plusHours(1));
        flight.setBasePrice(BigDecimal.valueOf(5000));
        flight.setStatus(FlightStatus.SCHEDULED);
        flight.setTotalCapacity(72);
        flight.setAvailableSeats(72);
    }



    @Test
    void addFlightsTest() {

        FlightDto flightDto = new FlightDto(
                "SF101",
                "Chennai",
                "Bangalore",
                LocalDateTime.now().plusDays(5),
                LocalDateTime.now().plusDays(5).plusHours(1),
                BigDecimal.valueOf(5000)
        );

        when(userRepository.findByEmailAndIsActiveTrue("kavin@gmail.com"))
                .thenReturn(Optional.of(owner));

        when(flightRepository.save(any(Flight.class)))
                .thenReturn(flight);

        Flight result = flightService.addFlights(flightDto, "kavin@gmail.com");

        assertNotNull(result);
        assertEquals(owner, result.getOwner());

        verify(userRepository, times(1))
                .findByEmailAndIsActiveTrue("kavin@gmail.com");

        verify(flightRepository, times(1))
                .save(any(Flight.class));

        verify(seatRepository, times(1))
                .saveAll(anyList());
    }


    @Test
    void addFlightsShouldGenerate72Seats() {

        FlightDto flightDto = new FlightDto(
                "SF101",
                "Chennai",
                "Bangalore",
                LocalDateTime.now().plusDays(5),
                LocalDateTime.now().plusDays(5).plusHours(1),
                BigDecimal.valueOf(5000)
        );

        when(userRepository.findByEmailAndIsActiveTrue("kavin@gmail.com"))
                .thenReturn(Optional.of(owner));

        when(flightRepository.save(any(Flight.class)))
                .thenReturn(flight);

        ArgumentCaptor<List<Seat>> seatCaptor =
                ArgumentCaptor.forClass(List.class);

        flightService.addFlights(flightDto, "kavin@gmail.com");

        verify(seatRepository).saveAll(seatCaptor.capture());

        List<Seat> seats = seatCaptor.getValue();

        assertEquals(72, seats.size());

        // First 12 seats are Business
        for (int i = 0; i < 12; i++) {
            assertEquals(SeatClass.BUSINESS, seats.get(i).getSeatClass());
            assertEquals(SeatStatus.AVAILABLE, seats.get(i).getStatus());
            assertEquals(flight, seats.get(i).getFlight());
        }

        // Remaining 60 seats are Economy
        for (int i = 12; i < 72; i++) {
            assertEquals(SeatClass.ECONOMY, seats.get(i).getSeatClass());
            assertEquals(SeatStatus.AVAILABLE, seats.get(i).getStatus());
            assertEquals(flight, seats.get(i).getFlight());
        }
    }




    @Test
    void getFlightByCompanyTest() {

        FlightByCompanyRespDto dto = new FlightByCompanyRespDto(
                "SimplyFly",
                "SF101",
                "Chennai",
                "Bangalore",
                FlightStatus.SCHEDULED,
                72,
                72,
                flight.getDepartureTime(),
                flight.getArrivalTime()
        );
        when(flightRepository.getFlightByCompany(
                eq("SimplyFly"),
                any(Pageable.class)
        )).thenReturn(List.of(dto));

        List<FlightByCompanyRespDto> result =
                flightService.getFlightByCompany(
                        "SimplyFly",
                        0,
                        10
                );



        verify(flightRepository, times(1))
                .getFlightByCompany(
                        eq("SimplyFly"),
                        any(Pageable.class)
                );
    }










    @Test
    void cancelFlightByIdShouldCancelFlightAndRelatedData() {

        when(flightRepository.findById(1))
                .thenReturn(Optional.of(flight));

        Seat seat = new Seat();
        seat.setSeatId(101);
        seat.setFlight(flight);
        seat.setSeatNumber("3A");
        seat.setSeatClass(SeatClass.ECONOMY);
        seat.setStatus(SeatStatus.AVAILABLE);

        Booking booking = new Booking();
        booking.setBookingId(10);
        booking.setFlight(flight);
        booking.setBookingStatus(BookingStatus.CONFIRMED);

        Passenger passenger = new Passenger();
        passenger.setPassengerId(20);
        passenger.setBooking(booking);
        passenger.setSeat(seat);
        passenger.setPassengerName("Arun");
        passenger.setAge(25);
        passenger.setGender("Male");
        passenger.setETicketNumber("ET100");
        passenger.setStatus(PassengerStatus.ACTIVE);

        Payment payment = new Payment();
        payment.setPaymentId(30);
        payment.setBooking(booking);
        payment.setAmountPaid(BigDecimal.valueOf(5000));
        payment.setRefundedAmount(BigDecimal.ZERO);
        payment.setPaymentStatus(PaymentStatus.SUCCESS);

        when(seatRepository.findSeatsByFlightId(1))
                .thenReturn(List.of(seat));

        when(bookingRepository.findFlightByFlightId(1))
                .thenReturn(List.of(booking));

        when(passengerRepository.findPassengerByBookingId(10))
                .thenReturn(List.of(passenger));

        when(paymentRepository.findPaymentByBookingId(10))
                .thenReturn(Optional.of(payment));

        flightService.cancelFlightById(1);

        assertEquals(FlightStatus.CANCELLED, flight.getStatus());
        assertEquals(0, flight.getAvailableSeats());

        assertEquals(SeatStatus.LOCKED, seat.getStatus());

        assertEquals(
                BookingStatus.CANCELLED,
                booking.getBookingStatus()
        );

        assertEquals(
                PassengerStatus.CANCELLED,
                passenger.getStatus()
        );

        assertEquals(
                PaymentStatus.REFUNDED,
                payment.getPaymentStatus()
        );

        assertEquals(
                BigDecimal.valueOf(5000),
                payment.getRefundedAmount()
        );

        verify(flightRepository).save(flight);
        verify(seatRepository).saveAll(anyList());
        verify(passengerRepository).saveAll(anyList());
        verify(paymentRepository).save(payment);
        verify(bookingRepository).saveAll(anyList());
    }


    @Test
    void cancelFlightByIdShouldThrowWhenFlightNotFound() {

        when(flightRepository.findById(1))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> flightService.cancelFlightById(
                        1
                )
        );

        assertEquals(
                "Flight not found!.",
                exception.getMessage()
        );

        verify(userRepository, never())
                .findByEmailAndIsActiveTrue(anyString());
    }





    @Test
    void lockSeatShouldLockAvailableSeats() {

        Seat seat1 = new Seat();
        seat1.setSeatId(1);
        seat1.setFlight(flight);
        seat1.setSeatNumber("3A");
        seat1.setSeatClass(SeatClass.ECONOMY);
        seat1.setStatus(SeatStatus.AVAILABLE);

        Seat seat2 = new Seat();
        seat2.setSeatId(2);
        seat2.setFlight(flight);
        seat2.setSeatNumber("3B");
        seat2.setSeatClass(SeatClass.ECONOMY);
        seat2.setStatus(SeatStatus.AVAILABLE);

        flight.setAvailableSeats(72);

        when(seatRepository.findMultipleSeats(
                1,
                List.of("3A", "3B")
        )).thenReturn(List.of(seat1, seat2));

        flightService.lockSeat(
                1,
                List.of("3A", "3B")
        );

        assertEquals(SeatStatus.LOCKED, seat1.getStatus());
        assertEquals(SeatStatus.LOCKED, seat2.getStatus());

        assertEquals(
                70,
                flight.getAvailableSeats()
        );

        verify(seatRepository).saveAll(List.of(seat1, seat2));
        verify(flightRepository).save(flight);
    }


    @Test
    void lockSeatShouldCancelPassengerAndRefundForBookedSeat() {

        flight.setBasePrice(BigDecimal.valueOf(5000));
        flight.setAvailableSeats(72);

        Seat seat = new Seat();
        seat.setSeatId(1);
        seat.setFlight(flight);
        seat.setSeatNumber("3A");
        seat.setSeatClass(SeatClass.ECONOMY);
        seat.setStatus(SeatStatus.BOOKED);

        Booking booking = new Booking();
        booking.setBookingId(10);

        Passenger passenger = new Passenger();
        passenger.setPassengerId(20);
        passenger.setBooking(booking);
        passenger.setSeat(seat);
        passenger.setStatus(PassengerStatus.ACTIVE);

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setRefundedAmount(BigDecimal.ZERO);

        when(seatRepository.findMultipleSeats(
                1,
                List.of("3A")
        )).thenReturn(List.of(seat));

        when(passengerRepository.findPassengerBySeatAndStatus(
                1,
                PassengerStatus.ACTIVE
        )).thenReturn(Optional.of(passenger));

        when(paymentRepository.findPaymentByBookingId(10))
                .thenReturn(Optional.of(payment));

        flightService.lockSeat(
                1,
                List.of("3A")
        );

        assertEquals(
                PassengerStatus.CANCELLED,
                passenger.getStatus()
        );

        assertEquals(
                BigDecimal.valueOf(5000),
                payment.getRefundedAmount()
        );

        assertEquals(
                SeatStatus.LOCKED,
                seat.getStatus()
        );

        // Booked seat is NOT counted as available seat reduction
        assertEquals(
                72,
                flight.getAvailableSeats()
        );

        verify(passengerRepository).save(passenger);
        verify(paymentRepository).save(payment);
        verify(seatRepository).saveAll(List.of(seat));
        verify(flightRepository).save(flight);
    }

    @Test
    void enableSeatTest() {

        flight.setAvailableSeats(70);

        Seat seat1 = new Seat();
        seat1.setSeatId(1);
        seat1.setFlight(flight);
        seat1.setSeatNumber("3A");
        seat1.setStatus(SeatStatus.LOCKED);

        Seat seat2 = new Seat();
        seat2.setSeatId(2);
        seat2.setFlight(flight);
        seat2.setSeatNumber("3B");
        seat2.setStatus(SeatStatus.LOCKED);

        when(seatRepository.findMultipleSeats(
                1,
                List.of("3A", "3B")
        )).thenReturn(List.of(seat1, seat2));

        flightService.enableSeat(
                1,
                List.of("3A", "3B")
        );

        assertEquals(
                SeatStatus.AVAILABLE,
                seat1.getStatus()
        );

        assertEquals(
                SeatStatus.AVAILABLE,
                seat2.getStatus()
        );

        assertEquals(
                72,
                flight.getAvailableSeats()
        );

        verify(seatRepository).saveAll(List.of(seat1, seat2));
        verify(flightRepository).save(flight);
    }

    @Test
    void getFlightDetailsTest() {

        when(userRepository.findByEmailAndIsActiveTrue(
                "kavin@gmail.com"
        )).thenReturn(Optional.of(owner));

        when(flightRepository.getFlightDetails(
                "kavin@gmail.com"
        )).thenReturn(List.of(flight));

        List<FlightResDto> result =
                flightService.getFlightDetails(
                        "kavin@gmail.com"
                );

        assertNotNull(result);
        assertEquals(1, result.size());

        FlightResDto dto = result.getFirst();

        assertEquals("SF101", dto.flightNumber());
        assertEquals("SimplyFly", dto.company());
        assertEquals("Chennai", dto.origin());
        assertEquals("Bangalore", dto.destination());
        assertEquals("SCHEDULED", dto.status());
        assertEquals(BigDecimal.valueOf(5000), dto.basePrice());
        assertEquals(72, dto.availableSeats());

        verify(userRepository)
                .findByEmailAndIsActiveTrue("kavin@gmail.com");

        verify(flightRepository)
                .getFlightDetails("kavin@gmail.com");
    }


    @Test
    void getFlightDetailsShouldThrowWhenOwnerNotFound() {

        when(userRepository.findByEmailAndIsActiveTrue(
                "wrong@gmail.com"
        )).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> flightService.getFlightDetails(
                        "wrong@gmail.com"
                )
        );

        assertEquals(
                "User not found",
                exception.getMessage()
        );

        verify(flightRepository, never())
                .getFlightDetails(anyString());
    }


    @Test
    void updateFlightTest() {

        when(flightRepository.findById(1))
                .thenReturn(Optional.of(flight));

        FlightDto dto = new FlightDto(
                "SF202",
                "Coimbatore",
                "Mumbai",
                LocalDateTime.now().plusDays(10),
                LocalDateTime.now().plusDays(10).plusHours(2),
                BigDecimal.valueOf(8000)
        );

        String result =
                flightService.updateFlight(
                        1,
                        dto

                );

        assertEquals(
                "Flight has been successfully edited!",
                result
        );

        assertEquals("SF202", flight.getFlightNumber());
        assertEquals("Coimbatore", flight.getOrigin());
        assertEquals("Mumbai", flight.getDestination());
        assertEquals(dto.departureTime(), flight.getDepartureTime());
        assertEquals(dto.arrivalTime(), flight.getArrivalTime());
        assertEquals(dto.basePrice(), flight.getBasePrice());

        verify(flightRepository).save(flight);
    }



    @Test
    void getPassengerForFlightTest() {

        Seat seat = new Seat();
        seat.setSeatId(1);
        seat.setSeatNumber("3A");
        seat.setSeatClass(SeatClass.ECONOMY);
        seat.setStatus(SeatStatus.BOOKED);
        seat.setFlight(flight);

        Passenger passenger = new Passenger();
        passenger.setPassengerId(20);
        passenger.setPassengerName("Arun");
        passenger.setAge(25);
        passenger.setGender("Male");
        passenger.setETicketNumber("ET100");
        passenger.setSeat(seat);
        passenger.setStatus(PassengerStatus.ACTIVE);

        when(flightRepository.findById(1))
                .thenReturn(Optional.of(flight));

        when(passengerRepository.findPassengersForFlight(1))
                .thenReturn(List.of(passenger));

        List<PassengerHistoryDto> result =
                flightService.getPassengerForFlight(
                        1
                );

        assertNotNull(result);
        assertEquals(1, result.size());

        PassengerHistoryDto dto = result.getFirst();

        assertEquals(20, dto.passengerId());
        assertEquals("Arun", dto.passengerName());
        assertEquals(25, dto.age());
        assertEquals("Male", dto.gender());
        assertEquals("ET100", dto.eTicketNumber());
        assertEquals("3A", dto.seatNumber());
        assertEquals("ECONOMY", dto.seatClass());
        assertEquals("ACTIVE", dto.passengerStatus());

        verify(flightRepository).findById(1);
        verify(passengerRepository).findPassengersForFlight(1);
    }

}
