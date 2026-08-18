const fs = require('fs');
const path = require('path');

const src = require('./thirukkural.json').kural;
const outPath = path.join(__dirname, 'thirukkural_de.json');

async function translateBatch(texts, sl='en', tl='de'){
  const payload = texts.map(t => `q=${encodeURIComponent(t)}`).join('&');
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&ie=UTF-8&oe=UTF-8&${payload}`;
  const res = await fetch(url);
  if(!res.ok) throw new Error(`Translate failed: ${res.status}`);
  const j = await res.json();
  return j[0].map(e => (e&&e[0])?e[0]:"");
}

(async ()=>{
  const batchSize = 50;
  const translations = new Array(src.length).fill('');
  const explanations = new Array(src.length).fill('');

  console.log(`Translating ${src.length} verses (in batches of ${batchSize})...`);
  for(let i=0;i<src.length;i+=batchSize){
    const slice = src.slice(i, i+batchSize).map(k => k.Translation || '');
    try{
      const res = await translateBatch(slice, 'en', 'de');
      for(let j=0;j<res.length;j++) translations[i+j] = (res[j]||'').trim();
    }catch(e){
      console.error('Batch verse translate failed at', i, e.message);
      // fallback to original
      for(let j=0;j<slice.length;j++) translations[i+j] = slice[j] || '';
    }
    await new Promise(r=>setTimeout(r, 200));
  }

  console.log('Translating explanations...');
  for(let i=0;i<src.length;i+=batchSize){
    const slice = src.slice(i, i+batchSize).map(k => k.explanation || '');
    try{
      const res = await translateBatch(slice, 'en', 'de');
      for(let j=0;j<res.length;j++) explanations[i+j] = (res[j]||'').trim();
    }catch(e){
      console.error('Batch explanation translate failed at', i, e.message);
      for(let j=0;j<slice.length;j++) explanations[i+j] = slice[j] || '';
    }
    await new Promise(r=>setTimeout(r, 200));
  }

  const out = { kural: src.map((k, idx) => ({ Number: k.Number, deTranslation: translations[idx] || k.Translation || '', deExplanation: explanations[idx] || k.explanation || '' })) };
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote ${outPath} with ${out.kural.length} items`);
})();
