const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO || 'deruvomichele-cloud/phoenix-forge';
const GITHUB_FILE = 'data/phoenixes.json';
const GITHUB_API = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`;

let cache = null;
let cacheSha = null;

async function readDB() {
  if (cache) return cache;
  try {
    const res = await fetch(GITHUB_API, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' },
    });
    if (res.status === 404) { cache = []; cacheSha = null; return cache; }
    const data = await res.json();
    cacheSha = data.sha;
    cache = JSON.parse(Buffer.from(data.content, 'base64').toString('utf8'));
    return cache;
  } catch { return cache || []; }
}

async function writeDB(phoenixes) {
  if (!GITHUB_TOKEN) return;
  try {
    cache = phoenixes;
    const content = Buffer.from(JSON.stringify(phoenixes, null, 2)).toString('base64');
    const body = { message: `Update collection (${phoenixes.length} NFTs)`, content, ...(cacheSha && { sha: cacheSha }) };
    const res = await fetch(GITHUB_API, {
      method: 'PUT',
      headers: { Authorization: `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json', Accept: 'application/vnd.github.v3+json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.content?.sha) cacheSha = data.content.sha;
  } catch {}
}

// Video proxy — serves MP4s from GitHub Releases with correct headers, no redirect
const VIDEO_BASE = 'https://github.com/deruvomichele-cloud/phoenix-nft-simple/releases/download/v1.0/';
app.get('/videos/:file', async (req, res) => {
  try {
    const url = VIDEO_BASE + req.params.file;
    const upstream = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'PhoenixForge/1.0' } });
    if (!upstream.ok) return res.status(404).send('Not found');
    res.set('Content-Type', 'video/mp4');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cache-Control', 'public, max-age=86400');
    const buf = await upstream.arrayBuffer();
    res.send(Buffer.from(buf));
  } catch (e) {
    res.status(500).send('Error: ' + e.message);
  }
});

app.use(cors({ origin: true }));
app.use(express.json({ limit: '12mb' }));

const DIST = path.join(__dirname, 'frontend', 'dist');
if (fs.existsSync(DIST)) app.use(express.static(DIST));

app.get('/api/health', async (_req, res) => {
  res.json({ ok: true, db: 'github', token: !!GITHUB_TOKEN });
});

app.get('/api/phoenixes', async (_req, res) => {
  const phoenixes = await readDB();
  res.json(phoenixes.map(d => ({
    ...d,
    videoUrl: d.videoRemoteUrl && !d.videoRemoteUrl.includes('openrouter.ai') ? d.videoRemoteUrl : undefined,
  })));
});

app.put('/api/phoenixes/:id', async (req, res) => {
  const { id } = req.params;
  const phoenixes = await readDB();
  const idx = phoenixes.findIndex(p => p.id === id);
  const entry = { ...req.body, id };
  if (idx >= 0) phoenixes[idx] = entry; else phoenixes.unshift(entry);
  await writeDB(phoenixes);
  res.json({ ok: true });
});

app.delete('/api/phoenixes/:id', async (req, res) => {
  const phoenixes = await readDB();
  cache = phoenixes.filter(p => p.id !== req.params.id);
  await writeDB(cache);
  res.json({ ok: true });
});

app.get('*', (_req, res) => {
  if (fs.existsSync(DIST)) res.sendFile(path.join(DIST, 'index.html'));
  else res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`🔥 Phoenix Forge on port ${PORT}`);
});
