const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const Inventory = require('./Operaciones_CRUD/Inventory');
const Categories = require('./Operaciones_CRUD/Categories');
const Provider = require('./Operaciones_CRUD/Provider');
const { verifyUser, createUser } = require('./Operaciones_CRUD/Users');
const { createContact } = require('./Operaciones_CRUD/Contacts');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Servir archivos estáticos del frontend (app-INNTEAL/public)
// Acceso esperado: http://localhost:3001/public/images/...
app.use('/public', express.static(path.join(__dirname, '..', 'app-INNTEAL', 'public')));
app.use('/images', express.static(path.join(__dirname, '..', 'app-INNTEAL', 'public', 'images')));

// Health
app.get('/api/health', (req, res) => res.json({ success: true, msg: 'ok' }));

app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('POST /api/auth/login received. body ->', req.body);
    const { email, password } = req.body || {};
    if (!email || !password) {
      console.log('POST /api/auth/login: missing credentials');
      return res.status(400).json({ success: false, message: 'Faltan credenciales' });
    }

    const result = await verifyUser(email, password);
    console.log('verifyUser result ->', result);
    if (!result.success) {
      console.log('Authentication failed for', email);
      return res.status(401).json({ success: false, message: result.message });
    }

    console.log('Authentication success for', email, 'sending token (length):', result.token ? result.token.length : 0);
    return res.json({ success: true, token: result.token, user: result.user });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Error interno' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('POST /api/auth/register body ->', req.body);
    const { name, email, password, phone, company, role, address, profileUrl, acceptTerms } = req.body || {};

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Faltan campos obligatorios (name, email, password)' });
    }

    const result = await createUser({ name, email, password, phone, company, role, address, profileUrl, acceptTerms });
    console.log('createUser result ->', result);

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    // opcional: no incluir user completo si no quieres exponer datos
    return res.json({ success: true, message: result.message, user: result.user });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Error interno en registro' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    console.log('POST /api/contact body ->', req.body);
    const data = req.body || {};
    const result = await createContact(data);
    console.log('createContact result ->', result);
    if (!result.success) return res.status(400).json(result);
    return res.json(result);
  } catch (err) {
    console.error('Contact error:', err);
    return res.status(500).json({ success: false, message: 'Error interno en contacto' });
  }
});

/* INVENTARIO */
app.get('/api/inventario', async (req, res) => {
  try {
    const items = await Inventory.getItems();
    console.log(`[API] /api/inventario -> items: ${Array.isArray(items) ? items.length : 0}`);
    res.json({ success: true, data: items });
  } catch (err) {
    console.error('GET /api/inventario error:', err);
    res.status(500).json({ success: false, message: 'Error obteniendo inventario' });
  }
});
app.get('/api/inventario/:id', async (req, res) => {
  try {
    const item = await Inventory.getItemById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'No encontrado' });
    res.json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false }); }
});
app.post('/api/inventario', async (req, res) => {
  try {
    const out = await Inventory.createItem(req.body);
    res.json({ success: true, id: out.id });
  } catch (err) { res.status(500).json({ success: false, message: 'Error creando item' }); }
});
app.put('/api/inventario/:id', async (req, res) => {
  try {
    const r = await Inventory.updateItem(req.params.id, req.body);
    res.json({ success: true, affected: r });
  } catch (err) { res.status(500).json({ success: false }); }
});
app.delete('/api/inventario/:id', async (req, res) => {
  try {
    const r = await Inventory.deleteItem(req.params.id);
    res.json({ success: true, affected: r });
  } catch (err) { res.status(500).json({ success: false }); }
});

/* CATEGORÍAS */
app.get('/api/categorias', async (req, res) => {
  try {
    const rows = await Categories.getCategories();
    console.log(`[API] /api/categorias -> rows: ${Array.isArray(rows) ? rows.length : 0}`);
    // respuesta normalizada para frontend
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('GET /api/categorias error:', err);
    res.status(500).json({ success: false, message: 'Error obteniendo categorías' });
  }
});

// Endpoint de debug - devuelve el array tal cual (útil para probar desde el navegador / curl)
app.get('/api/categorias/raw', async (req, res) => {
  try {
    const rows = await Categories.getCategories();
    console.log(`[API] /api/categorias/raw -> rows: ${Array.isArray(rows) ? rows.length : 0}`);
    res.json(rows);
  } catch (err) {
    console.error('GET /api/categorias/raw error:', err);
    res.status(500).send(String(err));
  }
});
app.get('/api/categorias/:id', async (req, res) => {
  try {
    const r = await Categories.getCategoryById(req.params.id);
    if (!r) return res.status(404).json({ success: false });
    res.json({ success: true, data: r });
  } catch (err) { res.status(500).json({ success: false }); }
});
app.post('/api/categorias', async (req, res) => {
  try {
    const out = await Categories.createCategory(req.body);
    res.json({ success: true, id: out.id });
  } catch (err) { res.status(500).json({ success: false }); }
});
app.put('/api/categorias/:id', async (req, res) => {
  try {
    const r = await Categories.updateCategory(req.params.id, req.body);
    res.json({ success: true, affected: r });
  } catch (err) { res.status(500).json({ success: false }); }
});
app.delete('/api/categorias/:id', async (req, res) => {
  try {
    const r = await Categories.deleteCategory(req.params.id);
    res.json({ success: true, affected: r });
  } catch (err) { res.status(500).json({ success: false }); }
});

/* PROVEEDORES */
app.get('/api/proveedores', async (req, res) => {
  try {
    const rows = await Provider.getProviders();
    console.log(`[API] /api/proveedores -> rows: ${Array.isArray(rows) ? rows.length : 0}`);
    res.json({ success: true, data: rows });
  } catch (err) { 
    console.error('GET /api/proveedores error:', err);
    res.status(500).json({ success: false }); 
  }
});
app.get('/api/proveedores/:id', async (req, res) => {
  try {
    const r = await Provider.getProviderById(req.params.id);
    if (!r) return res.status(404).json({ success: false });
    res.json({ success: true, data: r });
  } catch (err) { res.status(500).json({ success: false }); }
});
app.post('/api/proveedores', async (req, res) => {
  try {
    const out = await Provider.createProvider(req.body);
    res.json({ success: true, id: out.id });
  } catch (err) { res.status(500).json({ success: false }); }
});
app.put('/api/proveedores/:id', async (req, res) => {
  try {
    const r = await Provider.updateProvider(req.params.id, req.body);
    res.json({ success: true, affected: r });
  } catch (err) { res.status(500).json({ success: false }); }
});
app.delete('/api/proveedores/:id', async (req, res) => {
  try {
    const r = await Provider.deleteProvider(req.params.id);
    res.json({ success: true, affected: r });
  } catch (err) { res.status(500).json({ success: false }); }
});

app.listen(PORT, () => {
  console.log(`API INNTEAL escuchando en http://localhost:${PORT}`);
});
