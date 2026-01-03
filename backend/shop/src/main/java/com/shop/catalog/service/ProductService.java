package com.shop.catalog.service;

import com.shop.catalog.dto.ProductDto;
import com.shop.catalog.entity.Product;
import com.shop.catalog.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // <- generates constructor for final fields
public class ProductService {

    private final ProductRepository repo; // Spring injects this bean

    /* ---------- read ---------- */
    @Cacheable(value = "products", key = "#id", unless = "#result == null")
    public ProductDto getById(Long id) {
        Product p = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return toDto(p);
    }

    @Cacheable(value = "products", key = "'all'")   // sau "#root.methodName" dacă vrei
    public List<ProductDto> getAll() {
        return repo.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /* ---------- update ---------- */
    @CacheEvict(value = "products", allEntries = true)
    public ProductDto update(ProductDto dto) {
        Product p = repo.findById(dto.id())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        p.setName(dto.name());
        p.setPrice(dto.price());
        p.setStock(dto.stock());
        p.setImageUrl(dto.imageUrl()); // <--- Update imagine
        Product saved = repo.save(p);
        return toDto(saved);
    }

    @CacheEvict(value = "products", allEntries = true)
    public boolean delete(Long id) {
        if (!repo.existsById(id)) {
            return false;               // nu exista
        }
        repo.deleteById(id);
        return true;                    // a şters
    }

    @CacheEvict(value = "products", allEntries = true)
    public void deleteAll() {
        repo.deleteAll();
    }

    @CacheEvict(value = "products", allEntries = true)
    public ProductDto create(ProductDto dto) {
        Product p = new Product();
        p.setName(dto.name());
        p.setPrice(dto.price());
        p.setStock(dto.stock());
        p.setImageUrl(dto.imageUrl()); // <--- Setare imagine la creare
        return toDto(repo.save(p));
    }

    public long count() {
        return repo.count();
    }

    public List<ProductDto> findLowStock(int threshold) {
        return repo.findByStockLessThan(threshold)
                .stream()
                .map(this::toDto)
                .toList();
    }

    /* ---------- helper ---------- */
    private ProductDto toDto(Product p) {
        return new ProductDto(p.getId(), p.getName(), p.getPrice(), p.getStock(), p.getImageUrl());
    }
}