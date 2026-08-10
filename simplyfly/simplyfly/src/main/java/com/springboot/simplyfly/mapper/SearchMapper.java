package com.springboot.simplyfly.mapper;

import com.springboot.simplyfly.dto.response.FlightSearchRespDto;
import com.springboot.simplyfly.model.Flight;
import org.springframework.stereotype.Component;

@Component
public class SearchMapper {
    public static FlightSearchRespDto convertEntityToDto(Flight flight){
        return new FlightSearchRespDto(
                flight.getFlightId(),
                flight.getFlightNumber(),
                flight.getOwner().getCompanyName(),
                flight.getOrigin(),
                flight.getDestination(),
                flight.getDepartureTime(),
                flight.getArrivalTime(),
                flight.getBasePrice(),
                flight.getAvailableSeats(),
                flight.getStatus()
        );
    }
}
