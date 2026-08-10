package com.springboot.simplyfly.dto.response;

import com.springboot.simplyfly.enums.FlightStatus;

import java.time.Instant;
import java.time.LocalDateTime;

public record FlightByCompanyRespDto(
        String company,
        String flightNumber,
        String origin,
        String destination,
        FlightStatus status,
        int totalSeats,
        int availableSeats,
        LocalDateTime departureTime,
        LocalDateTime arrivalTime
) {
}
