package com.springboot.simplyfly.dto.response;

import com.springboot.simplyfly.enums.FlightStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record FlightSearchRespDto(
        Integer flightId,
        String flightNumber,
        String company,
        String origin,
        String destination,
        LocalDateTime departureTime,
        LocalDateTime arrivalTime,
        BigDecimal basePrice,
        Integer availableSeats,
        FlightStatus status
) {
}
