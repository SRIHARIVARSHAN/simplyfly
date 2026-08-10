package com.springboot.simplyfly.service;

import com.springboot.simplyfly.dto.request.BasePriceUpdateDto;
import com.springboot.simplyfly.dto.request.FlightDto;
import com.springboot.simplyfly.dto.response.FlightResDto;
import com.springboot.simplyfly.dto.response.FlightByCompanyRespDto;
import com.springboot.simplyfly.dto.response.PassengerHistoryDto;
import com.springboot.simplyfly.enums.*;
import com.springboot.simplyfly.exception.ResourceNotFoundException;
import com.springboot.simplyfly.mapper.FlightMapper;
import com.springboot.simplyfly.model.*;
import com.springboot.simplyfly.repository.*;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FlightService {
    private final FlightRepository flightRepository;
    private final UserRepository userRepository;
    private final SeatRepository seatRepository;
    private final BookingRepository bookingRepository;
    private final PassengerRepository passengerRepository;
    private final PaymentRepository paymentRepository;

    public Flight addFlights(@Valid FlightDto flightDto,String ownerEmail) {
        User owner=userRepository.findByEmailAndIsActiveTrue(ownerEmail).orElseThrow(()->new RuntimeException("Owner not Found."));

        Flight flight=FlightMapper.convertDtoToEntity(flightDto);
        flight.setOwner(owner);
        Flight savedFlight=flightRepository.save(flight);
        generateSeats(savedFlight);
        return savedFlight;

    }

    private void generateSeats(Flight savedFlight) {
        List<Seat> seats = new ArrayList<>();
        String[] seatLetters = {"A", "B", "C", "D", "E", "F"};
        //Business class
        for(int row=1;row<=2;row++){
            for(String letter: seatLetters){
                Seat seat=new Seat();
                seat.setFlight(savedFlight);
                seat.setSeatNumber(row+letter);
                seat.setSeatClass(SeatClass.BUSINESS);
                seat.setStatus(SeatStatus.AVAILABLE);
                seats.add(seat);
            }
        }

        //Economy class
        for (int row = 3; row <= 12; row++) {
            for (String letter : seatLetters) {
                Seat seat = new Seat();
                seat.setFlight(savedFlight);
                seat.setSeatNumber(row + letter);
                seat.setSeatClass(SeatClass.ECONOMY);
                seat.setStatus(SeatStatus.AVAILABLE);
                seats.add(seat);
            }
        }
        seatRepository.saveAll(seats);
    }

    public List<FlightByCompanyRespDto> getFlightByCompany(String companyName, int page, int size) {
        Pageable pageable= PageRequest.of(page,size);
        List<FlightByCompanyRespDto> list=flightRepository.getFlightByCompany(companyName,pageable);
        return list.stream()
                .map(FlightMapper::convertEntityToDto)
                .toList();

    }


    public void updateBasePriceById(Integer id, @Valid BasePriceUpdateDto basePriceUpdateDto) {
        Flight flight=flightRepository.findById(id).orElseThrow(()->new RuntimeException("Flight not found!."));
        flight.setBasePrice(basePriceUpdateDto.basePrice());

        flightRepository.save(flight);
    }


    public void cancelFlightById(Integer id, String username) {
        Flight flight=flightRepository.findById(id).orElseThrow(()
                ->new RuntimeException("Flight not found!."));
        User user=userRepository.findByEmailAndIsActiveTrue(username).orElseThrow(()
                ->new RuntimeException("User not found!"));

        if(!flight.getOwner().getUserId().equals(user.getUserId())){
            throw new RuntimeException("You can only cancel your flight");

        }
        flight.setStatus(FlightStatus.CANCELLED);
        flight.setAvailableSeats(0);
        flightRepository.save(flight);

        //lock seats
        List<Seat> seats = seatRepository.findByFlight_FlightId(id);
        for (Seat seat : seats) {
            seat.setStatus(SeatStatus.LOCKED);
        }
        seatRepository.saveAll(seats);

        //cancel bookings
        List<Booking> bookings = bookingRepository.findByFlight_FlightId(id);
        for(Booking booking:bookings){
            //booking cancel
            if(booking.getBookingStatus()== BookingStatus.CONFIRMED){
                booking.setBookingStatus(BookingStatus.CANCELLED);
            }

            //Passenger cancel
            List<Passenger> passengers=passengerRepository.findByBooking_BookingId(booking.getBookingId());
            for (Passenger passenger : passengers) {
                passenger.setStatus(PassengerStatus.CANCELLED);
            }
            passengerRepository.saveAll(passengers);

            Payment payment = paymentRepository.findByBooking_BookingId(booking.getBookingId())
                    .orElseThrow(() -> new RuntimeException("Payment not found for booking ID: " + booking.getBookingId()));

            payment.setPaymentStatus(PaymentStatus.REFUNDED);
            payment.setRefundedAmount(payment.getAmountPaid()); // 100% refund
            paymentRepository.save(payment);

            bookingRepository.saveAll(bookings);
        }
    }

    public void deleteFlight(Integer id) {
        Flight flight=flightRepository.fetchById(id).orElseThrow(()->new ResourceNotFoundException(("Flight not found!")));
        flight.setStatus(FlightStatus.CANCELLED);
        flight.setAvailableSeats(0);
        flightRepository.save(flight);
    }

    @Transactional
    public void lockSeat(Integer id, List<String> seatNo) {
        List<Seat> seats = seatRepository.findMultipleSeats(id, seatNo);
        Flight flight=seats.getFirst().getFlight();
        int seatSize = seatNo.size();
        int seatsToReduce =0;
        for(Seat seat: seats){
            if(seat.getStatus()==SeatStatus.BOOKED){
                Passenger passenger = passengerRepository.findBySeatAndStatus(seat.getSeatId(),PassengerStatus.ACTIVE)
                        .orElse(null);

                if(passenger!=null){
                    passenger.setStatus(PassengerStatus.CANCELLED);
                    passengerRepository.save(passenger);

                    BigDecimal refund = flight.getBasePrice();
                    if (seat.getSeatClass() == SeatClass.BUSINESS) {
                        refund = refund.multiply(BigDecimal.valueOf(3.18));
                    }

                    Booking booking=passenger.getBooking();
                    Payment payment =paymentRepository.findByBooking_BookingId(booking.getBookingId())
                            .orElseThrow(()->new RuntimeException("No Payment found"));
                    payment.setRefundedAmount(payment.getRefundedAmount().add(refund));
                    //payment.setPaymentStatus(PaymentStatus.REFUNDED);
                    paymentRepository.save(payment);
                }

            }

            else if(seat.getStatus()==SeatStatus.AVAILABLE){
                seatsToReduce++;
            }
            seat.setStatus(SeatStatus.LOCKED);
        }

        int remSeats=flight.getAvailableSeats();
        flight.setAvailableSeats(remSeats-seatsToReduce);
        seatRepository.saveAll(seats);
        flightRepository.save(flight);

    }

    @Transactional
    public void enableSeat(Integer id, List<String> seatNo) {
        List<Seat> seats = seatRepository.findMultipleSeats(id, seatNo);
        int seatSize = seatNo.size();
        for(Seat seat: seats){
            seat.setStatus(SeatStatus.AVAILABLE);
        }
        Flight flight=seats.get(0).getFlight();
        int remSeats=flight.getAvailableSeats();
        flight.setAvailableSeats(remSeats+seatSize);
        seatRepository.saveAll(seats);
        flightRepository.save(flight);

    }

    public List<FlightResDto> getFlightDetails(String ownerEmail) {
        User owner = userRepository.findByEmailAndIsActiveTrue(ownerEmail)
                .orElseThrow(()-> new RuntimeException("User not found"));

        //String companyName = owner.getCompanyName();

//        if (companyName == null || companyName.trim().isEmpty()) {
//            throw new RuntimeException("No company is associated with this account. Please contact Admin.");
//        }

        List<Flight> flights = flightRepository.getFlightDetails(ownerEmail);

        List<FlightResDto> flightResDtos = new ArrayList<>();

        for(Flight flight: flights){
            String companyName = flight.getOwner().getCompanyName();

            FlightResDto flightResDto = new FlightResDto(
                    flight.getFlightId(),
                    flight.getFlightNumber(),
                    companyName,
                    flight.getOrigin(),
                    flight.getDestination(),
                    flight.getStatus().toString(),
                    flight.getDepartureTime(),
                    flight.getArrivalTime(),
                    flight.getBasePrice(),
                    flight.getAvailableSeats()
            );
            flightResDtos.add(flightResDto);
        }
        return flightResDtos;
    }

    public String updateFlight(Integer flightId, @Valid FlightDto flightDto, String name) {
        Flight flight = flightRepository.findById(flightId).orElseThrow(()->new RuntimeException("Flight not found!"));

        flight.setFlightNumber(flightDto.flightNumber());
        flight.setOrigin(flightDto.origin());
        flight.setDestination(flightDto.destination());
        flight.setDepartureTime(flightDto.departureTime());
        flight.setArrivalTime(flightDto.arrivalTime());
        flight.setBasePrice(flightDto.basePrice());

        flightRepository.save(flight);

        return "Flight has been successfully edited!";
    }

    public List<PassengerHistoryDto> getPassengerForFlight(Integer flightId, String name) {
        Flight flight=flightRepository.findById(flightId).orElseThrow(()-> new RuntimeException("FLight not found!"));

        List<Passenger> passengers = passengerRepository.findPassengersForFlight(flightId);

        List<PassengerHistoryDto> passengerList = new ArrayList<>();

        for(Passenger passenger:passengers){
            PassengerHistoryDto passengerHistoryDto = new PassengerHistoryDto(
                    passenger.getPassengerId(),
                    passenger.getPassengerName(),
                    passenger.getAge(),
                    passenger.getGender(),
                    passenger.getETicketNumber(),
                    passenger.getSeat().getSeatNumber(),
                    passenger.getSeat().getSeatClass().toString(),
                    passenger.getStatus().toString()
            );
            passengerList.add(passengerHistoryDto);
        }

        return passengerList;
    }
}
