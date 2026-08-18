const fs = require('fs');
const path = require('path');

const dePath = path.join(__dirname, 'thirukkural_de.json');
const srcPath = path.join(__dirname, 'thirukkural.json');

const src = require(srcPath).kural;
let de = { kural: [] };
if (fs.existsSync(dePath)) de = require(dePath);
const map = new Map((de.kural||[]).map(k=>[Number(k.Number), k]));

function isMissing(orig, deText) {
  if (!deText) return true;
  const c = String(deText||'').trim();
  if (c === '') return true;
  if (c === orig) return true;
  // if still English-looking
  const asciiRatio = (c.match(/[A-Za-z]/g)||[]).length / Math.max(1, c.length);
  if (asciiRatio > 0.7) return true;
  return false;
}

async function translate(text) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=de&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Translate failed: ${res.status}`);
  const j = await res.json();
  return (j && j[0] && j[0][0] && j[0][0][0]) ? j[0][0][0] : '';
}

(async ()=>{
  let changed = 0;
  for (const k of src) {
    const num = Number(k.Number);
    const cur = map.get(num) || { Number: num };
    if (isMissing(k.Translation, cur.deTranslation)) {
      try {
        const t = await translate(k.Translation || '');
        if (t && t.trim()!=='' && t.trim()!==k.Translation) {
          cur.deTranslation = t.trim();
          changed++;
        }
      } catch(e) {
        console.error('translate error', num, e.message);
      }
      await new Promise(r=>setTimeout(r, 150));
    }
    if (isMissing(k.explanation, cur.deExplanation)) {
      try {
        const t = await translate(k.explanation || '');
        if (t && t.trim()!=='' && t.trim()!==k.explanation) {
          cur.deExplanation = t.trim();
          changed++;
        }
      } catch(e) { console.error('translate error', num, e.message); }
      await new Promise(r=>setTimeout(r, 150));
    }
    map.set(num, cur);
  }
  const out = { kural: Array.from(map.values()).sort((a,b)=>a.Number-b.Number) };
  fs.writeFileSync(dePath, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote ${dePath} (changed ${changed} fields)`);
})();
