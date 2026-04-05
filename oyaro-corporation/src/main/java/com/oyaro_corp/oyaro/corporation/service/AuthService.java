package com.oyaro_corp.oyaro.corporation.service;

import com.oyaro_corp.oyaro.corporation.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    // Auth logic goes here

    private UserRepository userRepository;
    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //
}
