const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'cambiar_este_secreto';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

async function verifyUser(email, password) {
  const user = await db.getUserByEmail(email);
  if (!user) {
    console.log(`verifyUser: usuario no encontrado -> ${email}`);
    return { success: false, message: 'Usuario no encontrado' };
  }

  const stored = user.password_hash || user.password;
  if (!stored) {
    console.log(`verifyUser: sin contraseña asociada -> ${email}`);
    return { success: false, message: 'No se encontró contraseña asociada' };
  }

  const matched = (typeof stored === 'string' && stored === password);

  if (!matched) {
    console.log(`verifyUser: credenciales inválidas para -> ${email}`);
    return { success: false, message: 'Credenciales inválidas' };
  }

  const payload = { sub: user.id, email: user.email, name: user.name };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  delete user.password_hash;
  delete user.password;

  console.log(`verifyUser: autenticación exitosa para -> ${email}`);

  return { success: true, message: 'Autenticación exitosa', token, user };
}

async function createUser(data) {
  const { name, email, password, phone = null, company = null, role = 'user', address = null, profileUrl = null, acceptTerms = 0 } = data;

  // comprobar existencia
  const existing = await db.getUserByEmail(email);
  if (existing) {
    return { success: false, message: 'Ya existe un usuario con ese correo' };
  }

  const plainPassword = password;

  const sql = `INSERT INTO users (email, password_hash, name, phone, company, role, address, profile_url, accept_terms)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [email, plainPassword, name, phone, company, role, address, profileUrl, acceptTerms ? 1 : 0];

  const [result] = await db.pool.execute(sql, params);
  const userId = result.insertId || null;

  const user = {
    id: userId,
    email,
    name,
    phone,
    company,
    role,
    address,
    profile_url: profileUrl,
    accept_terms: acceptTerms ? 1 : 0
  };

  return { success: true, message: 'Usuario creado', user };
}

module.exports = {
  verifyUser,
  createUser,
};
