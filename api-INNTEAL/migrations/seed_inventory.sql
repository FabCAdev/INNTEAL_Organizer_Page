USE INNTEAL_ORGANIZER;

-- Eliminar si ya existen (opcional para reinstalar)
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS categories;

-- TABLA: categories
CREATE TABLE IF NOT EXISTS categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  code VARCHAR(50) DEFAULT NULL,
  icon VARCHAR(64) DEFAULT NULL,
  description TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- TABLA: suppliers
CREATE TABLE IF NOT EXISTS suppliers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  code VARCHAR(50) DEFAULT NULL,
  email VARCHAR(200) DEFAULT NULL,
  phone VARCHAR(50) DEFAULT NULL,
  address TEXT DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  country VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- TABLA: items (artículos) con FK a categories y suppliers
CREATE TABLE IF NOT EXISTS items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(250) NOT NULL,
  sku VARCHAR(100) DEFAULT NULL,
  description TEXT DEFAULT NULL,
  category_id INT UNSIGNED DEFAULT NULL,
  supplier_id INT UNSIGNED DEFAULT NULL,
  stock INT DEFAULT 0,
  price DECIMAL(12,2) DEFAULT NULL,
  location VARCHAR(150) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_items_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_items_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insertar 5 categorías de ejemplo
INSERT INTO categories (id, name, code, icon, description) VALUES
(1, 'Electrónica', 'CAT-ELEC', '📦', 'Componentes electrónicos y dispositivos'),
(2, 'Herramientas', 'CAT-TOOLS', '🛠️', 'Herramientas manuales y eléctricas'),
(3, 'Repuestos', 'CAT-SPARE', '🔩', 'Piezas de recambio y repuestos'),
(4, 'Oficina', 'CAT-OFFICE', '🖇️', 'Material de oficina y consumibles'),
(5, 'Consumibles', 'CAT-CONS', '🧴', 'Consumibles y suministros');

-- Insertar 5 proveedores de ejemplo
INSERT INTO suppliers (id, name, code, email, phone, address, notes, country) VALUES
(1, 'Proveedor A', 'PROV-A', 'contacto@prov-a.example', '+34 600 000 001', 'C/ Falsa 123, Madrid', 'Entrega 24-48h', 'España'),
(2, 'Proveedor B', 'PROV-B', 'ventas@prov-b.example', '+34 600 000 002', 'Av. Industria 45, Barcelona', 'Pago a 30 días', 'España'),
(3, 'Proveedor C', 'PROV-C', 'info@prov-c.example', '+34 600 000 003', 'C/ Comercio 8, Valencia', NULL, 'España'),
(4, 'Proveedor D', 'PROV-D', 'sales@prov-d.example', '+34 600 000 004', 'Polígono Norte, Sevilla', 'Soporte técnico incluido', 'España'),
(5, 'Proveedor E', 'PROV-E', 'hello@prov-e.example', '+34 600 000 005', 'C/ Puerto 10, Alicante', 'Condiciones especiales para grandes volúmenes', 'España');

-- Insertar 5 artículos de ejemplo (referenciando categorías y proveedores)
INSERT INTO items (name, sku, description, category_id, supplier_id, stock, price, location) VALUES
('Resistencia 10kΩ', 'ELEC-R10K', 'Resistencia de película 10kΩ 1/4W', 1, 1, 150, 0.12, 'Almacén A / Estante 1'),
('Taladro inalámbrico 18V', 'TOOL-DR18', 'Taladro inalámbrico con batería 18V', 2, 2, 24, 89.90, 'Almacén B / Pasillo 3'),
('Juego de juntas y retenes', 'SPARE-JG01', 'Kit de juntas para mantenimiento', 3, 3, 60, 14.50, 'Almacén C / Caja 5'),
('Bloc de notas A4 80h', 'OFF-A4-80', 'Bloc de notas tamaño A4 80 hojas', 4, 5, 420, 1.25, 'Oficina / Estantería 2'),
('Tóner HP CF230X', 'CONS-TNR-CF230X', 'Tóner compatible HP alta capacidad', 5, 4, 35, 49.99, 'Almacén D / Estantería 7');

-- Comprobar inserciones (opcional)
SELECT COUNT(*) AS categorias_totales FROM categories;
SELECT COUNT(*) AS proveedores_totales FROM suppliers;
SELECT COUNT(*) AS items_totales FROM items;
