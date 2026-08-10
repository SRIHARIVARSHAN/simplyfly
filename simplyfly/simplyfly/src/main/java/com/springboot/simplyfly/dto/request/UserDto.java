package com.springboot.simplyfly.dto.request;

import com.springboot.simplyfly.enums.Role;
import jakarta.validation.constraints.*;

public record UserDto(
        @NotBlank(message = "Name cannot be blank")
        String name,

        @NotBlank(message = "Email cannot be blank")
        @Email(message = "Invalid email format")
        String email,

        @NotBlank(message = "Password cannot be blank")
        @Size(min = 6,message = "Password must be at least 6 characters!")
        String password,

        String phone,

        @NotNull(message = "Role is mandatory")
        Role role,
        String companyName
) {

    @AssertTrue(message = "Company name is mandatory for Flight Owners.")
    public boolean isValidCompanyForRole() {
        if (this.role == Role.FLIGHT_OWNER) {
            return this.companyName != null && !this.companyName.trim().isEmpty();
        }

        return true;
    }
}
