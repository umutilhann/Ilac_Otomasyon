require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

(async () => {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
  });

  // Reçeteli giriş
  app.post('/api/login/prescription', async (req, res) => {
    const { code } = req.body;
    try {
      const [rows] = await pool.query(
        'SELECT id, ad, skt, kullanim_talimati FROM ilaclar WHERE recete_kodu = ?',
        [code]
      );
      if (rows.length === 0) {
        return res.status(400).json({ error: 'Hatalı kod girişi.' });
      }
      res.json({ drugs: rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Sunucu hatası.' });
    }
  });

  // Reçetesiz giriş
  app.post('/api/login/without-prescription', async (req, res) => {
    const { tc } = req.body;
    try {
      const [rows] = await pool.query(
        'SELECT tc_kimlik, ad FROM hastalar WHERE tc_kimlik = ?',
        [tc]
      );
      if (rows.length === 0) {
        return res.status(400).json({ error: 'Hatalı TC kimlik numarası.' });
      }
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Sunucu hatası.' });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor.`);
  });
})();

