package com.springboot.simplyfly.service;

import com.springboot.simplyfly.dto.response.SeatResDto;
import com.springboot.simplyfly.mapper.SearchMapper;
import com.springboot.simplyfly.mapper.SeatMapper;
import com.springboot.simplyfly.model.Seat;
import com.springboot.simplyfly.repository.FlightRepository;
import com.springboot.simplyfly.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SeatService {

    private final SeatRepository seatRepository;
    private final FlightRepository flightRepository;


    public List<SeatResDto> getSeatsByFlightId(Integer flightId) {

        if(!flightRepository.existsById(flightId)){
            throw new RuntimeException("Flight with ID " + flightId + " not found!");
        }
        List<Seat> seats=seatRepository.findByFlight_FlightId(flightId);

        return seats.stream()
                .map(SeatMapper::convertEntityToDto)
                .toList();
    }
}
