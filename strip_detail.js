const fs = require('fs');
const path = require('path');

const detailPath = path.join(__dirname, 'data', 'detail.json');
const detail = JSON.parse(fs.readFileSync(detailPath, 'utf8'))[0];

function stripTitleFields(obj) {
  if (Array.isArray(obj)) {
    return obj.map(stripTitleFields);
  }
  if (obj && typeof obj === 'object') {
    const result = {};
    for (const key of Object.keys(obj)) {
      if (key === 'name' || key === 'translation' || key === 'transliteration') {
        continue;
      }
      result[key] = stripTitleFields(obj[key]);
    }
    return result;
  }
  return obj;
}

const structural = stripTitleFields(detail);

fs.writeFileSync(detailPath, JSON.stringify([structural], null, 2) + '\n', 'utf8');
console.log('detail.json restructured to pure structure.');
