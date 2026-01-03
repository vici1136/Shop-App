package com.shop.order.entity;

import com.shop.catalog.entity.Product;
import com.shop.order.entity.Order;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Data
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer quantity;

    // Salvăm prețul la momentul cumpărării (în caz că se scumpește produsul mai târziu)
    private BigDecimal price;
}