const db = require('../db');

async function getCategories(limit = 200, offset = 0) {
  const limitInt = Number.isFinite(+limit) ? Math.max(0, Math.trunc(+limit)) : 200;
  const offsetInt = Number.isFinite(+offset) ? Math.max(0, Math.trunc(+offset)) : 0;

  const sql = `SELECT id, name, code, icon, description
               FROM categories
               ORDER BY name
               LIMIT ${limitInt} OFFSET ${offsetInt}`;
  // Ejecutar y propagar errores para que server.js los registre
  const rows = await db.query(sql);
  return rows;
}

async function getCategoryById(id) {
  const rows = await db.query('SELECT * FROM categories WHERE id = ? LIMIT 1', [id]);
  return rows.length ? rows[0] : null;
}

async function createCategory(data) {
  const { name, code = null, icon = null, description = null } = data;
  const [result] = await db.pool.execute(
    'INSERT INTO categories (name, code, icon, description) VALUES (?, ?, ?, ?)',
    [name, code, icon, description]
  );
  return { id: result.insertId };
}

async function updateCategory(id, data) {
  const fields = ['name','code','icon','description'];
  const sets = [];
  const params = [];
  for (const f of fields) {
    if (f in data) { sets.push(`${f} = ?`); params.push(data[f]); }
  }
  if (!sets.length) return null;
  params.push(id);
  const sql = `UPDATE categories SET ${sets.join(', ')} WHERE id = ?`;
  const [res] = await db.pool.execute(sql, params);
  return res.affectedRows;
}

async function deleteCategory(id) {
  const [res] = await db.pool.execute('DELETE FROM categories WHERE id = ?', [id]);
  return res.affectedRows;
}

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
