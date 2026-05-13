const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

// GitHub DB config
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
    const body = { message: `Update collection`, content, ...(cacheSha && { sha: cacheSha }) };
    const res = await fetch(GITHUB_API, {
      method: 'PUT',
      headers: { Authorization: `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json', Accept: 'application/vnd.github.v3+json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.content?.sha) cacheSha = data.content.sha;
  } catch {}
}

// Video cache directory
const VIDEO_CACHE = '/tmp/videos';
if (!fs.existsSync(VIDEO_CACHE)) fs.mkdirSync(VIDEO_CACHE, { recursive: true });

// Video proxy — downloads from GitHub Releases, caches locally, serves with Range support
const GH_VIDEOS = 'https://github.com/deruvomichele-cloud/phoenix-nft-simple/releases/download/v1.0/';

app.get('/videos/:file', async (req, res) => {
  const file = req.params.file.replace(/[^a-zA-Z0-9._-]/g, '');
  const cachePath = path.join(VIDEO_CACHE, file);

  // Serve from local cache if exists
  if (fs.existsSync(cachePath)) {
    return res.sendFile(cachePath);
  }

  // Download and cache
  try {
    const upstream = await fetch(GH_VIDEOS + file, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!upstream.ok) return res.status(404).send('Not found');
    const buf = Buffer.from(await upstream.arrayBuffer());
    fs.writeFileSync(cachePath, buf);
    res.set('Content-Type', 'video/mp4');
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(buf);
  } catch (e) {
    res.status(500).send('Error: ' + e.message);
  }
});

app.use(cors({ origin: true }));
app.use(express.json({ limit: '12mb' }));

const DIST = path.join(__dirname, 'frontend', 'dist');
if (fs.existsSync(DIST)) app.use(express.static(DIST));

app.get('/api/health', (_req, res) => res.json({ ok: true, db: 'github', token: !!GITHUB_TOKEN }));

app.get('/api/phoenixes', async (_req, res) => {
  const phoenixes = await readDB();
  res.json(phoenixes.map(d => ({
    ...d,
    videoUrl: d.videoRemoteUrl && !d.videoRemoteUrl.includes('openrouter.ai') ? d.videoRemoteUrl : undefined,
  })));
});

app.put('/api/phoenixes/:id', async (req, res) => {
  const phoenixes = await readDB();
  const idx = phoenixes.findIndex(p => p.id === req.params.id);
  if (idx >= 0) phoenixes[idx] = { ...req.body, id: req.params.id };
  else phoenixes.unshift({ ...req.body, id: req.params.id });
  await writeDB(phoenixes);
  res.json({ ok: true });
});

app.delete('/api/phoenixes/:id', async (req, res) => {
  const phoenixes = await readDB();
  await writeDB(phoenixes.filter(p => p.id !== req.params.id));
  res.json({ ok: true });
});

app.get('*', (_req, res) => {
  if (fs.existsSync(DIST)) res.sendFile(path.join(DIST, 'index.html'));
  else res.json({ ok: true });
});

app.listen(PORT, () => console.log(`🔥 Phoenix Forge on port ${PORT}`));
