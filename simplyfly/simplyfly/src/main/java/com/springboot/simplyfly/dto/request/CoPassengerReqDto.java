package com.springboot.simplyfly.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CoPassengerReqDto(
        @NotBlank(message = "Passenger name is required")
        String passengerName,

        @NotNull(message = "Age is required")
        @Positive(message = "Age must be valid")
        Integer age,

        @NotBlank(message = "Gender is required")
        String gender,

        @NotBlank(message = "Seat Number must be selected")
        String seatNumber
) {
}
