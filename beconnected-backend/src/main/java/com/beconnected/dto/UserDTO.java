package com.beconnected.dto;

import java.time.LocalDate;

public record UserDTO(
        Long userId,
        String username,
        String firstName,
        String lastName,
        String email,
        String phone,
        LocalDate memberSince,
        String userRole,
        Boolean locked,
        Boolean enabled
) {
}
