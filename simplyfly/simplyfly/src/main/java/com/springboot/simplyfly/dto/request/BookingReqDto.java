package com.springboot.simplyfly.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record BookingReqDto(
        @NotNull(message = "Flight ID is required")
        Integer flightId,

        @NotBlank(message = "Payment method is required")
        String paymentMethod,

        @Valid
        @NotNull(message = "Passenger list cannot be null")
        @Size(min = 1, max = 4, message = "You can book maximum of 4 tickets at a time.")
        List<CoPassengerReqDto> coPassengers
) {
}
