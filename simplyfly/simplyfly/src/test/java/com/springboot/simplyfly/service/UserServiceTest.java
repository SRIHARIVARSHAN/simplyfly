package com.springboot.simplyfly.service;

import com.springboot.simplyfly.dto.request.UserDto;
import com.springboot.simplyfly.dto.response.DisabledUserDto;
import com.springboot.simplyfly.dto.response.UserResDto;
import com.springboot.simplyfly.enums.Role;
import com.springboot.simplyfly.model.User;
import com.springboot.simplyfly.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

//import static jdk.internal.org.objectweb.asm.util.CheckClassAdapter.verify;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private User user1;

    @BeforeEach
    public void init(){
        user1=new User(1, "kavin","kavin@gmail.com","kavin@123","9638527415", Role.ADMIN,null, LocalDateTime.now(),true);
    }

    @Test
    public void addUserTest(){
        user1.setPassword("encodedPass");
        when(userRepository.save(any(User.class))).thenReturn(user1);
        when(passwordEncoder.encode("kavin@123")).thenReturn("encodedPass");
        UserDto userDto=new UserDto(
                "kavin",
                "kavin@gmail.com",
                "kavin@123",
                "96388527415",
                Role.ADMIN,
                null
        );
        userService.add(userDto);

        ArgumentCaptor<User> userCaptor=ArgumentCaptor.forClass(User.class);
        verify(userRepository,times(1)).save(userCaptor.capture());

    }

    @Test
    public void getByRoleTest(){
        user1.setRole(Role.ADMIN);
        when(userRepository.getUserByRole(Role.ADMIN)).thenReturn(List.of(user1));

        List<UserResDto> result = userService.getUserByRole(Role.ADMIN);

        assertNotNull(result);
        assertEquals(1,result.size());

        UserResDto firstResult = result.getFirst();
        assertEquals(Role.ADMIN, firstResult.role());
        assertEquals("kavin", firstResult.name());

        verify(userRepository, times(1)).getUserByRole(Role.ADMIN);

    }

    @Test
    public void deleteUserTest() {
        // 1. Arrange: Mock finding the existing active user from the DB
        long userId = 1L;
        user1.setIsActive(true); // User starts out active

        when(userRepository.findById(userId)).thenReturn(Optional.of(user1));
        when(userRepository.save(any(User.class))).thenReturn(user1);

        // 2. Act: Trigger your service layer deletion logic
        userService.delete(userId); // Change to match your exact method name

        // 3. Assert & Verify: Use ArgumentCaptor to catch what was sent to save()
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);

        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, times(1)).save(userCaptor.capture());

        // Inspect the captured user to ensure the flag was flipped
        User updatedUser = userCaptor.getValue();

        // Replace '.isActive()' with your exact boolean getter name (e.g., isEnabled(), getIsDeleted())
        assertEquals(false, updatedUser.getIsActive());
    }

    @Test
    public void enableUserTest() {
        // 1. Arrange: Setup the target user ID and start with a disabled user
        long userId = 1L;
        user1.setIsActive(false); // Force state to false to simulate a disabled user

        // Stub the repository to return our disabled user, then save it
        when(userRepository.findById(userId)).thenReturn(Optional.of(user1));
        when(userRepository.save(any(User.class))).thenReturn(user1);

        // 2. Act: Call the service layer method
        userService.enableUser(userId);

        // 3. Assert & Verify: Capture the object sent to the database
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);

        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, times(1)).save(userCaptor.capture());


    }

    @Test
    public void getDisabledUserByRoleTest() {

        user1.setIsActive(false);
        user1.setRole(Role.PASSENGER);

        when(userRepository.getDisabledUserByRole(Role.PASSENGER)).thenReturn(java.util.List.of(user1));
        java.util.List<DisabledUserDto> resultList = userService.getDisabledUserByRole(Role.PASSENGER);
        // Verify
        verify(userRepository, times(1)).getDisabledUserByRole(Role.PASSENGER);
    }




}
