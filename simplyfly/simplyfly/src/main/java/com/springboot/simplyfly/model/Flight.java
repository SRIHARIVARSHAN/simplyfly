package com.springboot.simplyfly.model;

import com.springboot.simplyfly.enums.FlightStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "flights")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer flightId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", referencedColumnName = "userId")
    private User owner;

    @Column(nullable = false, unique = true)
    private String flightNumber;

    @Column(nullable = false)
    private String origin;

    @Column(nullable = false)
    private String destination;

    @Column(nullable = false)
    private LocalDateTime departureTime;

    @Column(nullable = false)
    private LocalDateTime arrivalTime;

    @Column(nullable = false)
    private BigDecimal basePrice;

    @Enumerated(EnumType.STRING)
    private FlightStatus status;

    @Column(nullable = false)
    private Integer totalCapacity = 72;

    @Column(nullable = false)
    private Integer availableSeats = 72;

}
