package com.springboot.simplyfly.controller;

import com.springboot.simplyfly.dto.request.BookingReqDto;
import com.springboot.simplyfly.dto.response.BookingHistoryDto;
import com.springboot.simplyfly.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/booking")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingService bookingService;
    /* body
    flight_id,
    payment method,
    coPassengers
     */
    @PostMapping("/add")
    public String addBooking(@Valid @RequestBody BookingReqDto bookingReqDto, Principal principal){
        String userName= principal.getName();
        return bookingService.addBooking(bookingReqDto,userName);
    }

    @GetMapping("/history")
    public List<BookingHistoryDto> getBookingHistory(Principal principal){
        return bookingService.getBookingHistory(principal.getName());

    }
}
