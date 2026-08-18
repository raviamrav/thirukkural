const fs = require('fs');
const path = require('path');
const src = require('./thirukkural.json').kural;
const outPath = path.join(__dirname,'thirukkural_de.json');

async function translateBatch(texts, sl='auto'){
  const payload = texts.map(t=>`q=${encodeURIComponent(t)}`).join('&');
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=de&dt=t&ie=UTF-8&oe=UTF-8&${payload}`;
  const res = await fetch(url);
  if(!res.ok) throw new Error(`Translate failed: ${res.status}`);
  const j = await res.json();
  return j[0].map(e => (e&&e[0])?e[0]:'');
}

(async ()=>{
  const batchSize = 40;
  const verses = [];
  for(const k of src){ verses.push(((k.Line1||'')+' '+(k.Line2||'')).trim() || k.Translation || ''); }
  const exps = src.map(k => k.explanation || '');

  const deVerses = new Array(src.length).fill('');
  const deExps = new Array(src.length).fill('');

  console.log('Translating verses from Tamil to German...');
  for(let i=0;i<verses.length;i+=batchSize){
    const slice = verses.slice(i, i+batchSize);
    try{
      const res = await translateBatch(slice, 'ta');
      for(let j=0;j<res.length;j++) deVerses[i+j] = (res[j]||'').trim();
    }catch(e){
      console.error('verse batch failed',i,e.message);
      for(let j=0;j<slice.length;j++) deVerses[i+j] = slice[j] || '';
    }
    await new Promise(r=>setTimeout(r,200));
  }

  console.log('Translating explanations from English to German...');
  for(let i=0;i<exps.length;i+=batchSize){
    const slice = exps.slice(i, i+batchSize);
    try{
      const res = await translateBatch(slice, 'en');
      for(let j=0;j<res.length;j++) deExps[i+j] = (res[j]||'').trim();
    }catch(e){
      console.error('exp batch failed',i,e.message);
      for(let j=0;j<slice.length;j++) deExps[i+j] = slice[j] || '';
    }
    await new Promise(r=>setTimeout(r,200));
  }

  const out = { kural: src.map((k,idx)=>({ Number: k.Number, deTranslation: deVerses[idx] || k.Translation || '', deExplanation: deExps[idx] || k.explanation || '' })) };
  fs.writeFileSync(outPath, JSON.stringify(out,null,2),'utf8');
  console.log(`Wrote ${outPath}`);
})();
