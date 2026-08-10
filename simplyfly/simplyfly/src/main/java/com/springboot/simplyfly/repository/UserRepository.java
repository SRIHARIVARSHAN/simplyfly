package com.springboot.simplyfly.repository;


import com.springboot.simplyfly.dto.response.UserResDto;
import com.springboot.simplyfly.enums.Role;
import com.springboot.simplyfly.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

//import java.lang.ScopedValue;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    @Query("""
            select u from User u where u.role = ?1 AND u.isActive = true
            """)
    List<User> getUserByRole(Role role);

//    @Query("""
//            select u from User u where u.name = ?1 AND u.isActive = true
//            """)
//    Optional<User> loadUserByUsername(String name);

    @Query("""
            select u from User u where u.email = ?1 AND u.isActive = true
            """)
    Optional<User> findByEmailAndIsActiveTrue(String email);

    @Query("""
            select u from User u where u.role = ?1 AND u.isActive = false
            """)
    List<User> getDisabledUserByRole(Role role);
}
