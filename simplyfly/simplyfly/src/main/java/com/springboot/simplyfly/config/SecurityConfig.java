package com.springboot.simplyfly.config;

import com.springboot.simplyfly.service.MyUserSecurityService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final MyUserSecurityService myUserSecurityService;
    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize->authorize
                        //.requestMatchers("/api/flights/get-flight/by-company").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/login").authenticated()
                        .requestMatchers("/api/auth/user-details").authenticated()
                        .requestMatchers(HttpMethod.POST,"/api/user/add").permitAll()

                        .requestMatchers(HttpMethod.GET,"/api/admin/user/booking-details/*").permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/admin/flight-details/*").permitAll()

                        .requestMatchers("/api/search/flights").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/airports/search").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/airports/all").permitAll()


                        .requestMatchers(HttpMethod.POST, "/api/auth/add/admin").denyAll()

                        .requestMatchers(HttpMethod.POST,"/api/passenger/add").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.DELETE,"/api/user/delete/*").permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/user/getByRole").permitAll()
                        .requestMatchers(HttpMethod.PATCH,"/api/user/enable/*").permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/user/get-disableduser").permitAll()

                        .requestMatchers(HttpMethod.PATCH, "/api/flights/seat/lock-seat/*").permitAll()
                        .requestMatchers(HttpMethod.PATCH, "/api/flights/seat/enable-seat/*").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/booking/add").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/booking/history").permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/flights/get-flight/by-company").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PATCH,"/api/flights/update-basePrice/*").hasAuthority("FLIGHT_OWNER")
                        .requestMatchers(HttpMethod.PUT,"/api/flights/cancel/*").permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/flights/get-passengers/byFlight/*").permitAll()
                        .requestMatchers(HttpMethod.DELETE,"/api/flights/delete-flight/*").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/flights/add-Details").hasAuthority("FLIGHT_OWNER")
                        .requestMatchers(HttpMethod.PUT, "/api/flights/update/*").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/flights/by-owner").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/ticket/cancel").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/seats/flight/*").permitAll()

                        //get seats
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public PasswordEncoder getEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authProvider(){
        DaoAuthenticationProvider dao = new DaoAuthenticationProvider(myUserSecurityService);
        dao.setPasswordEncoder(getEncoder());
        return dao;
    }

}