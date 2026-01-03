package com.shop.order.dto;

public record OrderItemRequest(
        Long productId,
        Integer quantity
) {}