package com.springboot.simplyfly.mapper;

import com.springboot.simplyfly.dto.response.SeatResDto;
import com.springboot.simplyfly.model.Seat;
import org.springframework.stereotype.Component;

@Component
public class SeatMapper {

    public static SeatResDto convertEntityToDto(Seat seat){
        return new SeatResDto(
                seat.getSeatId(),
                seat.getSeatNumber(),
                seat.getSeatClass(),
                seat.getStatus(),
                seat.getFlight().getFlightId()
        );

    }
}
