package com.springboot.simplyfly.exception;

import com.springboot.simplyfly.dto.response.ErrorMessageDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler  {
    private Logger logger =  LoggerFactory.getLogger("GlobalExceptionHandler.java");

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,String>> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException e
    ) {
        BindingResult result = e.getBindingResult();
        List<FieldError> list = result.getFieldErrors();
        Map<String, String> map = new HashMap<>();
        list.forEach(err -> {
            map.put(err.getField(), err.getDefaultMessage());
        });
        return ResponseEntity.badRequest().body(map);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorMessageDto> handleResourceNotFoundException(
            ResourceNotFoundException e
    ){
        return ResponseEntity.badRequest().body(new ErrorMessageDto(e.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorMessageDto> handleIllegalArgumentException(
            IllegalArgumentException e
    ){
        return ResponseEntity
                .badRequest()
                .body(new ErrorMessageDto(e.getMessage()));
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorMessageDto> handleInvalidCredentialsException(
            InvalidCredentialsException e
    ){
        return ResponseEntity
                .badRequest()
                .body(new ErrorMessageDto(e.getMessage()));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorMessageDto> handleRuntimeException(
            RuntimeException e
    ){
        return ResponseEntity
                .badRequest()
                .body(new ErrorMessageDto(e.getMessage()));
    }
}
