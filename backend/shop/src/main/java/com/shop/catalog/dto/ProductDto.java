package com.shop.catalog.dto;

import java.math.BigDecimal;

public record ProductDto(
        Long id,
        String name,
        BigDecimal price,
        Integer stock,
        String imageUrl // <--- Câmp nou
) {}