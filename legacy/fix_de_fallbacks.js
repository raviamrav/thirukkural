const fs = require('fs');
const path = require('path');
const taRegex = /\p{Script=Tamil}/u;

const src = require('./thirukkural.json').kural;
const dePath = path.join(__dirname,'thirukkural_de.json');
if(!fs.existsSync(dePath)){ console.error('thirukkural_de.json missing'); process.exit(1); }
const deData = require(dePath).kural || [];

let changed = 0, replacedTamil = 0, replacedEmpty = 0, replacedSameAsEn = 0;
const out = deData.map((d, idx) => {
  const num = Number(d.Number || (idx+1));
  const srcK = src.find(s=>Number(s.Number)===num) || {};
  const en = (srcK.Translation||'').trim();
  const enExp = (srcK.explanation||'').trim();
  let deTranslation = (d.deTranslation||'').trim();
  let deExplanation = (d.deExplanation||'').trim();

  const isTamil = (txt) => !!txt && taRegex.test(txt);
  const isEmpty = (txt) => !txt || txt.trim()==='';

  if(isTamil(deTranslation)){
    deTranslation = en || 'Deutsche Fassung folgt.';
    replacedTamil++;
    changed++;
  } else if(isEmpty(deTranslation)){
    deTranslation = en || 'Deutsche Fassung folgt.';
    replacedEmpty++;
    changed++;
  } else if(deTranslation === en){
    deTranslation = en || 'Deutsche Fassung folgt.';
    replacedSameAsEn++;
    changed++;
  }

  if(isTamil(deExplanation)){
    deExplanation = enExp || 'Deutsche Fassung folgt.';
    replacedTamil++;
    changed++;
  } else if(isEmpty(deExplanation)){
    deExplanation = enExp || 'Deutsche Fassung folgt.';
    replacedEmpty++;
    changed++;
  } else if(deExplanation === enExp){
    deExplanation = enExp || 'Deutsche Fassung folgt.';
    replacedSameAsEn++;
    changed++;
  }

  return { Number: num, deTranslation, deExplanation };
});

fs.writeFileSync(dePath, JSON.stringify({ kural: out }, null, 2),'utf8');
console.log(`Wrote ${dePath}. changed: ${changed}, replacedTamil:${replacedTamil}, replacedEmpty:${replacedEmpty}, replacedSameAsEn:${replacedSameAsEn}`);
