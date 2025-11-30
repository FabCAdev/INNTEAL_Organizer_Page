USE INNTEAL_ORGANIZER;

-- Opción A (NO RECOMENDADA): contraseña en texto plano
INSERT INTO users (email, password_hash, name)
VALUES ('abc123@gmail.com', 'abc123', 'Admin');

-- Opción B (RECOMENDADA): contraseña hasheada con bcrypt
-- Genera el hash con: node -e "console.log(require('bcrypt').hashSync('TuPassClaro',10))"
-- Luego descomenta e inserta reemplazando <HASH_AQUI>
-- INSERT INTO users (email, password_hash, name)
-- VALUES ('abc123@gmail.com', '<HASH_AQUI>', 'Admin');
