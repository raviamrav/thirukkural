const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'thirukkural.json');
const dePath = path.join(__dirname, 'thirukkural_de.json');

const src = require(srcPath).kural;
let de = { kural: [] };
if (fs.existsSync(dePath)) de = require(dePath);

function needsTranslation(orig, deText) {
  if (!deText) return true;
  const clean = (s) => String(s||'').trim();
  if (clean(deText) === '' ) return true;
  if (clean(deText) === clean(orig)) return true;
  // if deText contains many English words (heuristic: letters a-z and spaces) and length similar -> retranslate
  const asciiRatio = (deText.match(/[A-Za-z]/g)||[]).length / Math.max(1, deText.length);
  if (asciiRatio > 0.6) return true;
  return false;
}

async function translateBatch(texts) {
  const payload = texts.map((t) => `q=${encodeURIComponent(t)}`).join('&');
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=de&dt=t&ie=UTF-8&oe=UTF-8&${payload}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Translate request failed: ${res.status}`);
  const j = await res.json();
  return j[0].map(item => item[0]);
}

(async () => {
  const map = new Map((de.kural||[]).map(k => [Number(k.Number), k]));
  const toTranslate = [];
  const tasks = [];
  for (const k of src) {
    const existing = map.get(Number(k.Number)) || {};
    const deTrans = existing.deTranslation;
    const deExp = existing.deExplanation;
    if (needsTranslation(k.Translation, deTrans)) {
      toTranslate.push({ num: k.Number, type: 'verse', text: k.Translation });
    }
    if (needsTranslation(k.explanation, deExp)) {
      toTranslate.push({ num: k.Number, type: 'explanation', text: k.explanation });
    }
  }
  console.log(`Need to translate ${toTranslate.length} items`);
  const batchSize = 20;
  for (let i=0;i<toTranslate.length;i+=batchSize) {
    const batch = toTranslate.slice(i, i+batchSize);
    const texts = batch.map(b => b.text || '');
    try {
      const translated = await translateBatch(texts);
      for (let j=0;j<batch.length;j++) {
        const item = batch[j];
        const text = translated[j] || '';
        const num = Number(item.num);
        const cur = map.get(num) || { Number: num };
        if (item.type === 'verse') cur.deTranslation = text;
        else cur.deExplanation = text;
        map.set(num, cur);
      }
    } catch (err) {
      console.error('Batch translate failed', err);
      // on failure, leave originals
    }
    // polite pause
    await new Promise(r => setTimeout(r, 260));
  }

  const out = { kural: Array.from(map.values()).sort((a,b)=>a.Number-b.Number) };
  fs.writeFileSync(dePath, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote ${dePath} with ${out.kural.length} items`);
})();
