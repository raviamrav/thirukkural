const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

const inputPath = path.join(__dirname, 'data', 'thirukkural_EN.json');
const outputPath = path.join(__dirname, 'data', 'thirukkural_de.json');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function translateText(text, retries = 4) {
  const cleanText = (text || '').trim();
  if (!cleanText) return '';

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const result = await translate(cleanText, { from: 'en', to: 'de' });
      return result && result.text ? result.text : cleanText;
    } catch (error) {
      if (attempt === retries) {
        console.warn(`Fallback to original text after translation failure: ${cleanText}`);
        return cleanText;
      }
      await sleep(1500 * attempt);
    }
  }

  return cleanText;
}

async function main() {
  const source = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const kurals = source.kural || [];
  const translated = new Array(kurals.length);
  let completed = 0;
  let nextIndex = 0;

  const workerCount = 6;

  const worker = async () => {
    while (nextIndex < kurals.length) {
      const currentIndex = nextIndex++;
      const item = kurals[currentIndex];
      const deTranslation = await translateText(item.Translation || item.translation || item.text || '');
      const deExplanation = await translateText(item.explanation || '');

      translated[currentIndex] = {
        Number: item.Number,
        deTranslation,
        deExplanation,
      };

      completed += 1;
      if (completed % 25 === 0 || completed === kurals.length) {
        console.log(`Translated ${completed}/${kurals.length} entries`);
      }
    }
  };

  await Promise.all(Array.from({ length: Math.min(workerCount, kurals.length) }, worker));

  const output = { kural: translated.filter(Boolean) };
  fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(`German JSON rebuilt at ${outputPath} with ${translated.filter(Boolean).length} entries.`);
}

main().catch((error) => {
  console.error('German rebuild failed:', error);
  process.exit(1);
});
