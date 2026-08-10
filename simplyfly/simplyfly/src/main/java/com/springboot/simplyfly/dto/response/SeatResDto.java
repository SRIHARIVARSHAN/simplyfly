package com.springboot.simplyfly.dto.response;

import com.springboot.simplyfly.enums.SeatClass;
import com.springboot.simplyfly.enums.SeatStatus;

public record SeatResDto(
        Integer seatId,
        String seatNumber,
        SeatClass seatClass,
        SeatStatus status,
        Integer flightId
) {
}
