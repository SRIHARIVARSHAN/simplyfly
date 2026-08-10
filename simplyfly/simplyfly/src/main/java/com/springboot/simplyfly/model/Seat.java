package com.springboot.simplyfly.model;

import com.springboot.simplyfly.enums.SeatClass;
import com.springboot.simplyfly.enums.SeatStatus;
import com.springboot.simplyfly.model.Flight;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "seats")
@Data
@NoArgsConstructor
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer seatId;

    // Maps the flight_id foreign key
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    @Column(nullable = false)
    private String seatNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeatClass seatClass;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeatStatus status;
}