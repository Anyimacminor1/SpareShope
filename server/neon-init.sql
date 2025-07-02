-- Create parts table
CREATE TABLE IF NOT EXISTS parts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    desc TEXT,
    model TEXT,
    year INT,
    price NUMERIC,
    img TEXT
);

-- Sample data
INSERT INTO parts (name, desc, model, year, price, img) VALUES
('200Tdi Air Filter', 'Genuine air filter for Defender 200Tdi engines.', 'Defender', 1990, 29.99, 'assets/images/parts/air-filter-200tdi.jpg'),
('Air Suspension', 'OEM air suspension for Range Rover models.', 'Range Rover', 2010, 399.99, 'assets/images/parts/air-suspension.jpg'),
('Brake Pads', 'High-performance brake pads for Discovery.', 'Discovery', 2015, 49.99, 'assets/images/parts/brake-pads.jpg'),
('LED Headlight', 'LED headlight upgrade for Series models.', 'Series', 1975, 89.99, 'assets/images/parts/led-headlight.jpg'); 