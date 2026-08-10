package com.springboot.simplyfly.controller;

import com.springboot.simplyfly.dto.response.FlightSearchRespDto;
import com.springboot.simplyfly.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class SearchController {
    private final SearchService searchService;

    @GetMapping("/flights")
    public List<FlightSearchRespDto> searchFlight(@RequestParam String from,
                                                  @RequestParam String to,
                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                                  @RequestParam(required = false, defaultValue = "0") int page,
                                                  @RequestParam(required = false, defaultValue = "5") int size){
        System.out.println(date);
        return searchService.searchFlight(from,to,date,page,size);

    }

}
