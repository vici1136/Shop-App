package com.shop.catalog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.shop.catalog.entity.Product;

import java.util.*;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByStockLessThan(int threshold);
}

