package com.oyaro_corp.oyaro.corporation.controller;

import com.oyaro_corp.oyaro.corporation.dto.AuthRequest;
import com.oyaro_corp.oyaro.corporation.dto.RegisterRequest;
import org.apache.catalina.User;// Change this to our custom user entity later
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth/")
public class AuthController {
    //
    @PostMapping("/register")
    public void registerUser(@RequestBody RegisterRequest registerRequest) {
        //
    }

    @PostMapping("/login")
    public void login(@RequestBody AuthRequest authRequest) {
        //
    }
}
