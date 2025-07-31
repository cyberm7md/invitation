const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = process.env.PORT || 3000;

// Initialize SQLite database
const db = new sqlite3.Database('invitations.db');
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS scans (id INTEGER PRIMARY KEY, scanned_at TEXT)');
});

// Endpoint to check QR code
app.get('/check', (req, res) => {
  const id = parseInt(req.query.id);
  if (!id || id < 1 || id > 300) {
    return res.status(400).send('<h1>Invalid QR Code</h1>');
  }

  db.get('SELECT scanned_at FROM scans WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).send('<h1>Error</h1>');
    }

    if (row) {
      res.send('<h1 style="text-align: center; font-size: 100px;">✗</h1>');
    } else {
      db.run('INSERT INTO scans (id, scanned_at) VALUES (?, ?)', [id, new Date().toISOString()], (err) => {
        if (err) {
          return res.status(500).send('<h1>Error</h1>');
        }
        res.send('<h1 style="text-align: center; font-size: 100px;">✓</h1>');
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
