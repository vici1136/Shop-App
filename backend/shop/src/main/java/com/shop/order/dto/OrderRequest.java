package com.shop.order.dto;

import com.shop.order.dto.OrderItemRequest;

import java.util.List;

public record OrderRequest(
        List<OrderItemRequest> items
) {}