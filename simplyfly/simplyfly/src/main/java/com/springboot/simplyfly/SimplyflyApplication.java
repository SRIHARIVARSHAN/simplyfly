package com.springboot.simplyfly;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication
public class SimplyflyApplication {
	public static void main(String[] args) {
        SpringApplication.run(SimplyflyApplication.class, args);
    }
}
