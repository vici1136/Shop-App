-- Update admin & customer with BCrypt hash of "admin" / "customer"
-- Plain-text: admin   -> BCrypt: $2a$12$EixZaYbg1qa7KLdgLXh1Lu7V7gKjKZFzV5LlXjXVJc5v5lLKLsD5W
-- Plain-text: customer-> BCrypt: $2a$12$EixZaYbg1qa7KLdgLXh1Lu7V7gKjKZFzV5LlXjXVJc5v5lLKLsD5W
UPDATE users
SET password = '$2a$12$SL7dGF.9QyhE.KZC8.zi5e1.ey8WcS5hzT7YdxsKtEaT1cLELTmC2'
WHERE username = 'admin';

UPDATE users
SET password = '$2a$12$T32uXffAWP8jMXiUp6h2feu5wrtbA2hIvW1OfiAbG08agcNLrFvZu'
WHERE username = 'customer';