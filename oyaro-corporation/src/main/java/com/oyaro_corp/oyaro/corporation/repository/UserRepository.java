package com.oyaro_corp.oyaro.corporation.repository;

import org.springframework.data.jpa.repository.JpaRepository;

//import org.springframework.security.core.userdetails.User;
import com.oyaro_corp.oyaro.corporation.entity.User;

import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
}
