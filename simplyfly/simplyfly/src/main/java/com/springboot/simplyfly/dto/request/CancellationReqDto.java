package com.springboot.simplyfly.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CancellationReqDto(
        @NotNull(message = "Please enter your Booking ID")
        Integer bookingId,

        @NotEmpty(message = "Please enter Passenger ID(s) to cancel")
        List<Integer> passengerId
) {
}
