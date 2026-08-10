package com.springboot.simplyfly.controller;

import com.springboot.simplyfly.dto.request.CancellationReqDto;
import com.springboot.simplyfly.service.CancellationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/ticket")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class CancellationController {

    private final CancellationService cancellationService;

    /*
    BookingId,
    PassengerId
     */

    @PostMapping("/cancel")
    public String cancelTicket(@RequestBody CancellationReqDto cancellationReqDto, Principal principal){
        String userName= principal.getName();
        return cancellationService.cancelTicket(cancellationReqDto,userName);
    }
}
