package com.springboot.simplyfly.dto.request;


public record AdminDto(
        String email,
        String name,
        String password,
        String phone
) {
}
