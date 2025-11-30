USE INNTEAL_ORGANIZER;

CREATE TABLE IF NOT EXISTS contacts (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(30) DEFAULT NULL,
  company VARCHAR(255) DEFAULT NULL,
  subject VARCHAR(255) NOT NULL,
  type ENUM('general','soporte','venta','integracion') NOT NULL DEFAULT 'general',
  priority ENUM('normal','alta','urgente') NOT NULL DEFAULT 'normal',
  message TEXT NOT NULL,
  attachment_path VARCHAR(255) DEFAULT NULL,
  subscribe TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
