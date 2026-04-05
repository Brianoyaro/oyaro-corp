package com.oyaro_corp.oyaro.corporation.dto;

// Will be used when we log in a user in the service layer
public class AuthResponse {
    private String token;

    public AuthResponse() {}
    public AuthResponse(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }
    public void setToken(String token) {}
}
