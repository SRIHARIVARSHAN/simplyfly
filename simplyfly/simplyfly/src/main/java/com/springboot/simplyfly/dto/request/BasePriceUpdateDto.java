package com.springboot.simplyfly.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record BasePriceUpdateDto(
        @NotNull(message = "Base price cannot be null")
        @Positive(message = "Base price must be greater than zero")
        BigDecimal basePrice
) {
}