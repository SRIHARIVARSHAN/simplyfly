package com.springboot.simplyfly.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record FlightResDto(
        Integer flightId,
        String flightNumber,
        String company,
        String origin,
        String destination,
        String status,
        LocalDateTime departureTime,
        LocalDateTime arrivalTime,
        BigDecimal basePrice,
        Integer availableSeats
) {
}
