package com.springboot.simplyfly.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.springboot.simplyfly.enums.Role;

import java.util.Optional;

public record UserResDto(
        long id,
        String name,
        String email,
        Role role,

        @JsonInclude(JsonInclude.Include.NON_ABSENT)
        Optional<String> companyName
) {
}
