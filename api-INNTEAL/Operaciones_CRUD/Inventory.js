const db = require('../db');

async function getItems(limit = 500, offset = 0) {
  // Validar y normalizar a enteros seguros
  const limitInt = Number.isFinite(+limit) ? Math.max(0, Math.trunc(+limit)) : 500;
  const offsetInt = Number.isFinite(+offset) ? Math.max(0, Math.trunc(+offset)) : 0;

  const sql = `
    SELECT i.*, c.name AS category_name, s.name AS supplier_name, s.code AS supplier_code
    FROM items i
    LEFT JOIN categories c ON i.category_id = c.id
    LEFT JOIN suppliers s ON i.supplier_id = s.id
    ORDER BY i.name
    LIMIT ${limitInt} OFFSET ${offsetInt}`;

  // Ejecutar sin parámetros preparados para evitar errores con LIMIT/OFFSET
  const rows = await db.query(sql);
  return rows;
}

async function getItemById(id) {
  const sql = `
    SELECT i.*, c.name AS category_name, s.name AS supplier_name
    FROM items i
    LEFT JOIN categories c ON i.category_id = c.id
    LEFT JOIN suppliers s ON i.supplier_id = s.id
    WHERE i.id = ? LIMIT 1`;
  const rows = await db.query(sql, [id]);
  return rows.length ? rows[0] : null;
}

async function createItem(data) {
  const { name, sku = null, description = null, category_id = null, supplier_id = null, stock = 0, price = null, location = null } = data;
  const [result] = await db.pool.execute(
    `INSERT INTO items (name, sku, description, category_id, supplier_id, stock, price, location)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, sku, description, category_id, supplier_id, Number(stock), price, location]
  );
  return { id: result.insertId };
}

async function updateItem(id, data) {
  const fields = ['name','sku','description','category_id','supplier_id','stock','price','location'];
  const sets = [];
  const params = [];
  for (const f of fields) {
    if (f in data) { sets.push(`${f} = ?`); params.push(data[f]); }
  }
  if (!sets.length) return null;
  params.push(id);
  const sql = `UPDATE items SET ${sets.join(', ')} WHERE id = ?`;
  const [res] = await db.pool.execute(sql, params);
  return res.affectedRows;
}

async function deleteItem(id) {
  const [res] = await db.pool.execute('DELETE FROM items WHERE id = ?', [id]);
  return res.affectedRows;
}

module.exports = { getItems, getItemById, createItem, updateItem, deleteItem };
