const mysql = require('mysql2/promise');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'root';
const DB_DATABASE = process.env.DB_DATABASE || 'INNTEAL_ORGANIZER';
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function getUserByEmail(email) {
  const rows = await query('SELECT id, email, password_hash, name FROM users WHERE email = ? LIMIT 1', [email]);
  return rows.length ? rows[0] : null;
}

if (require.main === module) {
  (async () => {
    try {
      const conn = await pool.getConnection();
      await conn.ping();
      console.log(`Conexión OK a MySQL ${DB_HOST}:${DB_PORT} (DB: ${DB_DATABASE})`);
      // comprobar existencia de tabla users y contar registros
      try {
        const [rows] = await conn.execute('SELECT COUNT(*) AS c FROM users');
        console.log(`Tabla users existe. Registros: ${rows[0].c}`);
      } catch (qerr) {
        console.error('Error al consultar tabla users:', qerr.message);
        console.error('¿Creaste la tabla users en la BD seleccionada? Ejecuta las CREATE TABLE/USE mostradas anteriormente.');
      }
      conn.release();
      process.exit(0);
    } catch (err) {
      console.error('Error conectando a MySQL:', err.message);
      console.error('Comprueba: host/usuario/contraseña/puerto y que el servicio MySQL esté activo.');
      process.exit(1);
    }
  })();
}

module.exports = {
  pool,
  query,
  getUserByEmail,
};