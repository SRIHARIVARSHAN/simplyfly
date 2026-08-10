package com.springboot.simplyfly.dto.response;

public record PassengerHistoryDto(
        Integer passengerId,
        String passengerName,
        Integer age,
        String gender,
        String eTicketNumber,
        String seatNumber,
        String seatClass,
        String passengerStatus
) {
}
