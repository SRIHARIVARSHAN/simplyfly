package com.springboot.simplyfly.mapper;

import com.springboot.simplyfly.dto.request.FlightDto;
import com.springboot.simplyfly.dto.response.FlightByCompanyRespDto;
import com.springboot.simplyfly.enums.FlightStatus;
import com.springboot.simplyfly.model.Flight;
import jakarta.validation.Valid;
import org.springframework.stereotype.Component;

@Component
public class FlightMapper {
    public static Flight convertDtoToEntity(@Valid FlightDto flightDto) {
        Flight flight=new Flight();
        //flight.setFlightId(flightDto.ownerId());
        flight.setFlightNumber(flightDto.flightNumber());
        flight.setOrigin(flightDto.origin());
        flight.setStatus(FlightStatus.SCHEDULED);
        flight.setDestination(flightDto.destination());
        flight.setDepartureTime(flightDto.departureTime());
        flight.setArrivalTime(flightDto.arrivalTime());
        flight.setBasePrice(flightDto.basePrice());

        return flight;
    }

    public static FlightByCompanyRespDto convertEntityToDto(FlightByCompanyRespDto flightByCompanyRespDto){

        return new FlightByCompanyRespDto(
                flightByCompanyRespDto.company(),
                flightByCompanyRespDto.flightNumber(),
                flightByCompanyRespDto.origin(),
                flightByCompanyRespDto.destination(),
                flightByCompanyRespDto.status(),
                flightByCompanyRespDto.totalSeats(),
                flightByCompanyRespDto.availableSeats(),
                flightByCompanyRespDto.departureTime(),
                flightByCompanyRespDto.arrivalTime()
        );
    }
}
