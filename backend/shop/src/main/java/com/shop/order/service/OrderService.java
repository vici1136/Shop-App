package com.shop.order.service;

import com.shop.order.dto.OrderItemRequest;
import com.shop.order.dto.OrderRequest;
import com.shop.order.entity.Order;
import com.shop.order.entity.OrderItem;
import com.shop.catalog.entity.Product;
import com.shop.auth.entity.User;
import com.shop.order.repository.OrderRepository;
import com.shop.catalog.repository.ProductRepository;
import com.shop.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    /**
     * @Transactional - Asigură că toate modificările (stoc, order, items) se fac atomic.
     * @CacheEvict - Șterge cache-ul "products" (lista de produse) pentru că stocurile s-au schimbat.
     * 'allEntries = true' înseamnă că șterge toată lista, nu doar un produs specific.
     */
    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public Order createOrder(OrderRequest request, String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);

        BigDecimal totalPrice = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.items()) {
            Product product = productRepository.findById(itemRequest.productId())
                    .orElseThrow(() -> new RuntimeException("Produs inexistent: " + itemRequest.productId()));

            // Validare stoc
            if (product.getStock() < itemRequest.quantity()) {
                throw new RuntimeException("Stoc insuficient pentru: " + product.getName());
            }

            // Actualizare stoc
            product.setStock(product.getStock() - itemRequest.quantity());
            productRepository.save(product);

            // Creare Item
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.quantity());
            orderItem.setPrice(product.getPrice());

            order.getItems().add(orderItem);

            // Calcul total
            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.quantity()));
            totalPrice = totalPrice.add(itemTotal);
        }

        order.setTotalPrice(totalPrice);
        return orderRepository.save(order);
    }
}