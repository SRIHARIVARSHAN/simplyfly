package com.springboot.simplyfly.repository;

import com.springboot.simplyfly.model.Airport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AirportRepository extends JpaRepository<Airport,String> {

    @Query("""
            select a from Airport a where Lower(a.cityName) like Lower(Concat('%',?1,'%')) OR Lower(a.airportCode) LIKE LOWER(CONCAT('%', ?2, '%'))
            """)
    List<Airport> findAirports(String city, String code);
}
