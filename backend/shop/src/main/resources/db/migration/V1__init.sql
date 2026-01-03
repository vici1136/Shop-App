CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL
);

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    stock INTEGER NOT NULL
);

INSERT INTO users (username,password,role) VALUES
('admin','$2a$12$qC7qGj6qJ9qGj6qJ9qGj6uJ9qGj6uJ9qGj6uJ9qGj6uJ9qGj6uJ9','ADMIN'),
('customer','$2a$12$qC7qGj6qJ9qGj6qJ9qGj6uJ9qGj6uJ9qGj6uJ9qGj6uJ9qGj6uJ9','CUSTOMER');

INSERT INTO products (name,price,stock) VALUES
('Laptop',2999.99,10),('Mouse',99.99,50),('Keyboard',199.99,30);