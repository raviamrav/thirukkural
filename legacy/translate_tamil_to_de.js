const fs = require('fs');
const path = require('path');

const src = require('./thirukkural.json').kural;
const dePath = path.join(__dirname, 'thirukkural_de.json');
let de = { kural: [] };
if (fs.existsSync(dePath)) de = require(dePath);
const map = new Map((de.kural||[]).map(k=>[Number(k.Number), k]));

async function translate(text, sl='auto', tl='de'){
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Translate failed: ${res.status}`);
  const j = await res.json();
  return (j && j[0] && j[0][0] && j[0][0][0]) ? j[0][0][0] : '';
}

(async ()=>{
  let changed=0;
  for(const k of src){
    const num=Number(k.Number);
    const cur = map.get(num) || { Number: num };
    // Verse: translate from Tamil lines when missing or equal to English
    const needsVerse = !cur.deTranslation || cur.deTranslation.trim()==='' || cur.deTranslation.trim()=== (k.Translation||'').trim();
    if(needsVerse){
      const tamilText = ((k.Line1||'')+' '+(k.Line2||'')).trim();
      if(tamilText){
        try{
          const t = await translate(tamilText,'ta','de');
          if(t && t.trim()!==''){
            cur.deTranslation = t.trim();
            changed++;
          }
        }catch(e){ console.error('verse translate error',num,e.message); }
        await new Promise(r=>setTimeout(r,180));
      }
    }
    // Explanation: translate from English explanation when missing
    const needsExp = !cur.deExplanation || cur.deExplanation.trim()==='' || cur.deExplanation.trim()===(k.explanation||'').trim();
    if(needsExp){
      const eng = k.explanation||'';
      if(eng){
        try{
          const t = await translate(eng,'en','de');
          if(t && t.trim()!==''){
            cur.deExplanation = t.trim();
            changed++;
          }
        }catch(e){ console.error('exp translate error',num,e.message); }
        await new Promise(r=>setTimeout(r,180));
      }
    }
    map.set(num,cur);
  }
  const out = { kural: Array.from(map.values()).sort((a,b)=>a.Number-b.Number) };
  fs.writeFileSync(dePath, JSON.stringify(out,null,2),'utf8');
  console.log(`Wrote ${dePath} with ${out.kural.length} items, changed ${changed}`);
})();
