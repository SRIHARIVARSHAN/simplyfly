package com.springboot.simplyfly.controller;

import com.springboot.simplyfly.dto.request.BasePriceUpdateDto;
import com.springboot.simplyfly.dto.request.FlightDto;
import com.springboot.simplyfly.dto.response.FlightResDto;
import com.springboot.simplyfly.dto.response.FlightByCompanyRespDto;
import com.springboot.simplyfly.dto.response.PassengerHistoryDto;
import com.springboot.simplyfly.model.Flight;
import com.springboot.simplyfly.service.FlightService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/flights")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class FlightController {
    private final FlightService flightService;

    /*
    body{
        Integer ownerId,
        String flightNumber,
        String origin,
        String destination,
        LocalDateTime departureTime,
        LocalDateTime arrivalTime,
        BigDecimal basePrice
    } */

    @PostMapping("/add-Details")
    public Flight addFlights(@Valid @RequestBody FlightDto flightDto,Principal principal){
        String ownerEmail = principal.getName();
        return flightService.addFlights(flightDto,ownerEmail);
    }

    @PutMapping("/update/{flightId}")
    public String updateFlight(@PathVariable Integer flightId, @Valid @RequestBody FlightDto flightDto, Principal principal) {
        String response = flightService.updateFlight(flightId, flightDto, principal.getName());
        return response;
    }

    @GetMapping("/get-flight/by-company")
    public List<FlightByCompanyRespDto> getFlightByCompany(@RequestParam String companyName,
                                                           @RequestParam(required = false, defaultValue = "0") int page,
                                                           @RequestParam(required = false, defaultValue = "5") int size){
        return flightService.getFlightByCompany(companyName,page,size);
    }

    @PatchMapping("update-basePrice/{id}")
    public void updateBasePriceById(@PathVariable Integer id,
                                    @Valid @RequestBody BasePriceUpdateDto basePriceUpdateDto){
        flightService.updateBasePriceById(id,basePriceUpdateDto);
    }
    @PutMapping("cancel/{id}")
    public void updateStatusById(@PathVariable Integer id, Principal principal){
        String username= principal.getName();
        flightService.cancelFlightById(id,username);
    }

    @DeleteMapping("delete-flight/{id}")
    public void deleteFlight(@PathVariable Integer id){
        flightService.deleteFlight(id);
    }

    @PatchMapping("/seat/lock-seat/{id}")
    public void lockSeat(@PathVariable Integer id,
                         @RequestParam List<String> seatNo){
        flightService.lockSeat(id,seatNo);
    }

    @PatchMapping("/seat/enable-seat/{id}")
    public void enableSeat(@PathVariable Integer id,
                         @RequestParam List<String> seatNo){
        flightService.enableSeat(id,seatNo);
    }


    @GetMapping("/by-owner")
    public List<FlightResDto> getFlightDetails(Principal principal){
        String email = principal.getName();
        return flightService.getFlightDetails(email);
    }

    @GetMapping("/get-passengers/byFlight/{flightId}")
    public List<PassengerHistoryDto>  getPassengersForFlight(@PathVariable Integer flightId,Principal principal){
        return flightService.getPassengerForFlight(flightId,principal.getName());
    }


}
