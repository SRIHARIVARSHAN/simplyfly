package com.springboot.simplyfly.controller;

import com.springboot.simplyfly.model.Airport;
import com.springboot.simplyfly.repository.AirportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/airports")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AirportController {

    private final AirportRepository airportRepository;

    @GetMapping("/all")
    public List<Airport> getAll(){
        return airportRepository.findAll();
    }

    @GetMapping("/search")
    public List<Airport> searchAirports(@RequestParam String keyword){
        return airportRepository.findAirports(keyword, keyword);
    }
}
