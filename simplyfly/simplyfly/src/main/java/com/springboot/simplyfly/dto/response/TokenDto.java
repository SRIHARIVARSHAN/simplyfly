package com.springboot.simplyfly.dto.response;

public record TokenDto(
        String token,
        String expiration,
        String role
) {
}
