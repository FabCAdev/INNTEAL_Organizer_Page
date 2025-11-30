USE INNTEAL_ORGANIZER;

-- 1) Verificar registro (reemplaza :id)
SELECT * FROM users WHERE id = :id;

-- 2) Borrar el registro (opción simple)
DELETE FROM users WHERE id = :id;

-- 3) Comprobar cuántas filas se eliminaron
SELECT ROW_COUNT() AS deleted_rows;

-- Alternativa segura usando variable
-- SET @id = 123;
-- START TRANSACTION;
-- DELETE FROM users WHERE id = @id;
-- SELECT ROW_COUNT() AS deleted_rows;
-- COMMIT;
