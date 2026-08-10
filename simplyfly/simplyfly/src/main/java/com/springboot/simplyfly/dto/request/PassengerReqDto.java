package com.springboot.simplyfly.dto.request;

public record PassengerReqDto(
        String email,
        String name,
        String password,
        String phone
) {
}
