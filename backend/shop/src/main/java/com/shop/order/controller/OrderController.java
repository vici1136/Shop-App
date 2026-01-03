package com.shop.order.controller;

import com.shop.order.dto.OrderRequest;
import com.shop.order.entity.Order;
import com.shop.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService; // Injectăm Service-ul, NU Repository-urile

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        try {
            // Delegăm toată logica către service
            Order order = orderService.createOrder(request, userDetails.getUsername());

            return ResponseEntity.ok("Comanda a fost plasată cu succes! ID: " + order.getId());

        } catch (RuntimeException e) {
            // Prindem excepțiile de business (ex: stoc insuficient)
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}