const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// SQLite DB — persisted to /data/phoenixes.db on Fly.io volumes
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'phoenixes.db'));

// Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS phoenixes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    elements TEXT NOT NULL,
    image_url TEXT DEFAULT '',
    video_url TEXT,
    video_remote_url TEXT,
    video_job_id TEXT,
    video_model_id TEXT,
    status TEXT NOT NULL,
    variation_label TEXT,
    created_at INTEGER NOT NULL
  )
`);

app.use(cors({ origin: true }));
app.use(express.json({ limit: '20mb' }));

// Serve React frontend
const DIST = path.join(__dirname, 'frontend', 'dist');
if (fs.existsSync(DIST)) {
  app.use(express.static(DIST));
}

// API
app.get('/api/health', (req, res) => {
  res.json({ ok: true, db: 'sqlite' });
});

app.get('/api/phoenixes', (req, res) => {
  const rows = db.prepare('SELECT * FROM phoenixes ORDER BY created_at DESC').all();
  const phoenixes = rows.map(row => ({
    id: row.id,
    name: row.name,
    elements: JSON.parse(row.elements),
    imageUrl: row.image_url,
    videoUrl: row.video_url || undefined,
    videoRemoteUrl: row.video_remote_url || undefined,
    videoJobId: row.video_job_id || undefined,
    videoModelId: row.video_model_id || undefined,
    status: row.status,
    variationLabel: row.variation_label || undefined,
    createdAt: row.created_at,
  }));
  res.json(phoenixes);
});

app.put('/api/phoenixes/:id', (req, res) => {
  const { id } = req.params;
  const n = req.body;
  db.prepare(`
    INSERT INTO phoenixes (id, name, elements, image_url, video_url, video_remote_url, video_job_id, video_model_id, status, variation_label, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      elements = excluded.elements,
      image_url = excluded.image_url,
      video_url = excluded.video_url,
      video_remote_url = excluded.video_remote_url,
      video_job_id = excluded.video_job_id,
      video_model_id = excluded.video_model_id,
      status = excluded.status,
      variation_label = excluded.variation_label,
      created_at = excluded.created_at
  `).run(
    id,
    n.name,
    JSON.stringify(n.elements || []),
    n.imageUrl || '',
    n.videoUrl || null,
    n.videoRemoteUrl || null,
    n.videoJobId || null,
    n.videoModelId || null,
    n.status,
    n.variationLabel || null,
    n.createdAt || Date.now(),
  );
  res.json({ ok: true });
});

app.delete('/api/phoenixes/:id', (req, res) => {
  db.prepare('DELETE FROM phoenixes WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// SPA fallback
app.get('*', (req, res) => {
  if (fs.existsSync(DIST)) {
    res.sendFile(path.join(DIST, 'index.html'));
  } else {
    res.json({ error: 'Frontend not built yet. Run npm run build.' });
  }
});

app.listen(PORT, () => {
  console.log(`🔥 Phoenix Forge running on port ${PORT}`);
});
