package com.springboot.simplyfly.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record BookingHistoryDto(
        Integer bookingId,
        LocalDateTime bookingDate,
        String bookingStatus,
        BigDecimal totalAmount,

        String flightNumber,
        String origin,
        String destination,
        LocalDateTime departureTime,
        LocalDateTime arrivalTime,

        String paymentMethod,
        String paymentStatus,
        BigDecimal refundedAmount,

        List<PassengerHistoryDto> passengers
) {
}
