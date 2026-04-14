package com.oyaro_corp.oyaro.corporation.product.repository;

import com.oyaro_corp.oyaro.corporation.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
}
