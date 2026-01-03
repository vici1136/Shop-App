-- 1. Tabelul pentru comenzi
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    total_price DECIMAL(10, 2), -- Folosim DECIMAL pentru bani, e mai precis
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Cheie externă către tabela de useri (presupun că tabela ta se numește 'users' sau '_user')
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users (id)
);

-- 2. Tabelul pentru produsele din comandă
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL, -- Prețul la momentul achiziției

    -- Chei externe
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders (id),
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products (id)
);