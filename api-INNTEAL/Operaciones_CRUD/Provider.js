const db = require('../db');

async function getProviders(limit = 200, offset = 0) {
  const limitInt = Number.isFinite(+limit) ? Math.max(0, Math.trunc(+limit)) : 200;
  const offsetInt = Number.isFinite(+offset) ? Math.max(0, Math.trunc(+offset)) : 0;

  const sql = `SELECT id, name, code, email, phone, address, country
               FROM suppliers
               ORDER BY name
               LIMIT ${limitInt} OFFSET ${offsetInt}`;
  const rows = await db.query(sql);
  return rows;
}

async function getProviderById(id) {
  const rows = await db.query('SELECT * FROM suppliers WHERE id = ? LIMIT 1', [id]);
  return rows.length ? rows[0] : null;
}

async function createProvider(data) {
  const { name, code = null, email = null, phone = null, address = null, notes = null, country = null } = data;
  const [result] = await db.pool.execute(
    'INSERT INTO suppliers (name, code, email, phone, address, notes, country) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, code, email, phone, address, notes, country]
  );
  return { id: result.insertId };
}

async function updateProvider(id, data) {
  const fields = ['name','code','email','phone','address','notes','country'];
  const sets = [];
  const params = [];
  for (const f of fields) {
    if (f in data) { sets.push(`${f} = ?`); params.push(data[f]); }
  }
  if (!sets.length) return null;
  params.push(id);
  const sql = `UPDATE suppliers SET ${sets.join(', ')} WHERE id = ?`;
  const [res] = await db.pool.execute(sql, params);
  return res.affectedRows;
}

async function deleteProvider(id) {
  const [res] = await db.pool.execute('DELETE FROM suppliers WHERE id = ?', [id]);
  return res.affectedRows;
}

module.exports = { getProviders, getProviderById, createProvider, updateProvider, deleteProvider };
