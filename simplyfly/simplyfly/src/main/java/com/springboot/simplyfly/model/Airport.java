package com.springboot.simplyfly.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "airports")
@Data
public class Airport {

    @Id
    private String airportCode;

    private String cityName;

    private String airportName;
}
