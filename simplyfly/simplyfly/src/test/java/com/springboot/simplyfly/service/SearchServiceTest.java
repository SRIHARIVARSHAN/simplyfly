package com.springboot.simplyfly.service;

import com.springboot.simplyfly.dto.response.FlightSearchRespDto;
import com.springboot.simplyfly.enums.FlightStatus;
import com.springboot.simplyfly.model.Flight;
import com.springboot.simplyfly.model.User;
import com.springboot.simplyfly.repository.SearchRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SearchServiceTest {

    @InjectMocks
    private SearchService searchService;

    @Mock
    private SearchRepository searchRepository;

    @Test
    void searchFlightTest() {
        User owner = new User();

        Flight flight = new Flight();
        flight.setFlightId(1);
        flight.setFlightNumber("SF101");
        flight.setOwner(owner);
        flight.setOrigin("Chennai");
        flight.setDestination("Bangalore");
        flight.setDepartureTime(LocalDateTime.now().plusDays(2));
        flight.setArrivalTime(LocalDateTime.now().plusDays(2).plusHours(1));
        flight.setBasePrice(BigDecimal.valueOf(5000));
        flight.setAvailableSeats(70);
        flight.setStatus(FlightStatus.SCHEDULED);

        when(searchRepository.searchFlight(
                eq("Chennai"), eq("Bangalore"),
                any(LocalDate.class), any(Pageable.class)
        )).thenReturn(List.of(flight));

        List<FlightSearchRespDto> result =
                searchService.searchFlight(
                        "Chennai", "Bangalore",
                        LocalDate.now().plusDays(2), 0, 10
                );


        verify(searchRepository).searchFlight(
                eq("Chennai"), eq("Bangalore"),
                any(LocalDate.class), any(Pageable.class)
        );
    }

    @Test
    void searchFlightWhenNoFlightsTest() {

        when(searchRepository.searchFlight(
                eq("Chennai"), eq("Bangalore"),
                any(LocalDate.class), any(Pageable.class)
        )).thenReturn(List.of());

        List<FlightSearchRespDto> result =
                searchService.searchFlight(
                        "Chennai", "Bangalore",
                        LocalDate.now().plusDays(2), 0, 10
                );



        verify(searchRepository).searchFlight(
                eq("Chennai"), eq("Bangalore"),
                any(LocalDate.class), any(Pageable.class)
        );
    }
}