package com.springboot.simplyfly.service;

import com.springboot.simplyfly.dto.response.FlightSearchRespDto;
import com.springboot.simplyfly.mapper.SearchMapper;
import com.springboot.simplyfly.model.Flight;
import com.springboot.simplyfly.repository.SearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchService {
    private final SearchRepository searchRepository;

    public List<FlightSearchRespDto> searchFlight(String from, String to, LocalDate date, int page, int size) {
        Pageable pageable=PageRequest.of(page,size);
        List<Flight> list=searchRepository.searchFlight(from,to,date,pageable);
        return list
                .stream()
                .map(SearchMapper::convertEntityToDto)
                .toList();


    }
}
