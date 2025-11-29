INSERT INTO users (id, balance) VALUES (1, 500.00) ON CONFLICT DO NOTHING;

INSERT INTO products (name, price) VALUES
  ('Virtual Sword', 99.99),
  ('Magic Helmet', 149.50),
  ('Dragon Shield', 299.00)
ON CONFLICT (name) DO NOTHING;