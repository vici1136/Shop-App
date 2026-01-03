ALTER TABLE products ADD COLUMN image_url VARCHAR(512);

-- Opțional: Setează o imagine default pentru produsele existente
UPDATE products SET image_url = 'https://placehold.co/600x400?text=Produs' WHERE image_url IS NULL;