const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

// GitHub repo used as database
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO || 'deruvomichele-cloud/phoenix-forge';
const GITHUB_FILE = 'data/phoenixes.json';
const GITHUB_API = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`;

// In-memory cache so reads are fast
let cache = null;
let cacheSha = null;

async function readDB() {
  if (cache) return cache;
  try {
    const res = await fetch(GITHUB_API, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    if (res.status === 404) {
      cache = [];
      cacheSha = null;
      return cache;
    }
    const data = await res.json();
    cacheSha = data.sha;
    cache = JSON.parse(Buffer.from(data.content, 'base64').toString('utf8'));
    return cache;
  } catch (err) {
    console.error('readDB error:', err);
    return cache || [];
  }
}

async function writeDB(phoenixes) {
  if (!GITHUB_TOKEN) return;
  try {
    cache = phoenixes;
    const content = Buffer.from(JSON.stringify(phoenixes, null, 2)).toString('base64');
    const body = {
      message: `Update phoenixes collection (${phoenixes.length} NFTs)`,
      content,
      ...(cacheSha && { sha: cacheSha }),
    };
    const res = await fetch(GITHUB_API, {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.content?.sha) cacheSha = data.content.sha;
  } catch (err) {
    console.error('writeDB error:', err);
  }
}

app.use(cors({ origin: true }));
app.use(express.json({ limit: '12mb' }));

// Serve React frontend
const DIST = path.join(__dirname, 'frontend', 'dist');
if (fs.existsSync(DIST)) app.use(express.static(DIST));

app.get('/api/health', async (_req, res) => {
  res.json({ ok: true, db: 'github', repo: GITHUB_REPO, token: !!GITHUB_TOKEN });
});

app.get('/api/phoenixes', async (_req, res) => {
  const phoenixes = await readDB();
  res.json(phoenixes);
});

app.put('/api/phoenixes/:id', async (req, res) => {
  const { id } = req.params;
  const n = req.body;
  const phoenixes = await readDB();
  const idx = phoenixes.findIndex(p => p.id === id);
  const entry = { ...n, id };
  if (idx >= 0) phoenixes[idx] = entry;
  else phoenixes.unshift(entry);
  await writeDB(phoenixes);
  res.json({ ok: true });
});

app.delete('/api/phoenixes/:id', async (req, res) => {
  const phoenixes = await readDB();
  const filtered = phoenixes.filter(p => p.id !== req.params.id);
  cache = filtered;
  await writeDB(filtered);
  res.json({ ok: true });
});

// SPA fallback
app.get('*', (_req, res) => {
  if (fs.existsSync(DIST)) res.sendFile(path.join(DIST, 'index.html'));
  else res.json({ ok: true, msg: 'Phoenix Forge API running' });
});

app.listen(PORT, () => {
  console.log(`🔥 Phoenix Forge running on port ${PORT}`);
  console.log(`📦 GitHub DB: ${GITHUB_REPO}/${GITHUB_FILE}`);
});
