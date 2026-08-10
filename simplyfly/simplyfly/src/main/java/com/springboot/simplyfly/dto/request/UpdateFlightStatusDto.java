package com.springboot.simplyfly.dto.request;

import com.springboot.simplyfly.enums.FlightStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateFlightStatusDto(

        @NotNull(message = "Status cannot be blank.select any one status :SCHEDULED," +
                "    DELAYED," +
                "    CANCELLED," +
                "    COMPLETED")
        FlightStatus status
) {
}
