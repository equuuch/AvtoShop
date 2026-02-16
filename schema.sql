-- This is the complete schema for your database.
-- You can run this file in your Supabase SQL Editor to create all necessary tables.

-- 1. Create the 'products' table for services/products
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL, -- Added UNIQUE constraint to fix the error
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create the 'users' table for admin login
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Insert the exact services from your frontend into the 'products' table.
-- This ensures consistency when you switch to fetching data from the backend.
INSERT INTO products (name, description, price)
VALUES
  ('Техническое обслуживание', 'Компьютерная диагностика двигателя, ходовой части, электрики', 500),
  ('Диагностика', 'Замена амортизаторов, сайлентблоков, шаровых опор, ступиц', 1000),
  ('Чип-тюнинг', 'Замена масла в двигателе и фильтров, трансмиссионное масло', 500),
  ('Замена масла', 'Механика и автомат, замена сцепления, ремонт коробки передач', 2000)
ON CONFLICT (name) DO NOTHING;

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
