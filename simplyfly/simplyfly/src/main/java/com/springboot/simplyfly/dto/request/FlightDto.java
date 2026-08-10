package com.springboot.simplyfly.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record FlightDto(
        @NotBlank(message = "Flight number cannot be blank.")
        String flightNumber,

        @NotBlank(message = "Enter Origin Location!")
        String origin,

        @NotBlank(message = "Enter Destination Location!")
        String destination,

        @NotNull(message = "Departure time is required.")
        @Future(message = "Departure time must be future date and time.")
        LocalDateTime departureTime,

        @NotNull(message = "Arrival time is required.")
        @Future(message = "Arrival time must be a future date and time.")
        LocalDateTime arrivalTime,

        @NotNull(message = "Base price is required.")
        @Positive(message = "Base price must be greater than zero.")
        BigDecimal basePrice


) {
}
