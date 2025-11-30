const db = require('../db');

/**
 * Crear un nuevo contacto
 * data: { name, email, phone, company, subject, type, priority, message, attachmentPath, subscribe }
 */
async function createContact(data) {
  const {
    name,
    email,
    phone = null,
    company = null,
    subject = null,
    type = 'general',
    priority = 'normal',
    message = null,
    attachmentPath = null,
    subscribe = 0
  } = data || {};

  // validaciones básicas
  if (!name || !email || !subject || !message) {
    return { success: false, message: 'Faltan campos obligatorios (name, email, subject, message)' };
  }

  try {
    // SIN attachment_path: insertamos sólo los campos enviados por el formulario
    const sql = `INSERT INTO contacts
      (name, email, phone, company, subject, type, priority, message, subscribe, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
    const params = [name, email, phone, company, subject, type, priority, message, subscribe ? 1 : 0];
    const [result] = await db.pool.execute(sql, params);
    return { success: true, message: 'Contacto creado', id: result.insertId };
  } catch (err) {
    console.error('createContact error:', err);
    return { success: false, message: 'Error al crear contacto' };
  }
}

/**
 * Obtener lista de contactos (paginar en el caller si se necesita)
 */
async function getContacts(limit = 100, offset = 0) {
  try {
    const sql = `SELECT id, name, email, phone, company, subject, type, priority, subscribe, created_at
                 FROM contacts ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    const rows = await db.query(sql, [Number(limit), Number(offset)]);
    return { success: true, data: rows };
  } catch (err) {
    console.error('getContacts error:', err);
    return { success: false, message: 'Error al obtener contactos' };
  }
}

/**
 * Obtener un contacto por id
 */
async function getContactById(id) {
  try {
    const rows = await db.query('SELECT * FROM contacts WHERE id = ? LIMIT 1', [id]);
    if (!rows.length) return { success: false, message: 'Contacto no encontrado' };
    return { success: true, data: rows[0] };
  } catch (err) {
    console.error('getContactById error:', err);
    return { success: false, message: 'Error al obtener contacto' };
  }
}

/**
 * Eliminar contacto por id
 */
async function deleteContact(id) {
  try {
    const [result] = await db.pool.execute('DELETE FROM contacts WHERE id = ?', [id]);
    if (result.affectedRows === 0) return { success: false, message: 'Contacto no encontrado o ya eliminado' };
    return { success: true, message: 'Contacto eliminado' };
  } catch (err) {
    console.error('deleteContact error:', err);
    return { success: false, message: 'Error al eliminar contacto' };
  }
}

module.exports = {
  createContact,
  getContacts,
  getContactById,
  deleteContact
};