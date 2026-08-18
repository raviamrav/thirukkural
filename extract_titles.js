const fs = require('fs');
const path = require('path');

const detailPath = path.join(__dirname, 'data', 'detail.json');
const detail = JSON.parse(fs.readFileSync(detailPath, 'utf8'))[0];

const sectionTitles = { ta: {}, en: {} };
const groupTitles = { ta: {}, en: {} };
const chapterTitles = { ta: {}, en: {} };

for (const section of detail.section.detail) {
  sectionTitles.ta[String(section.number)] = section.name;
  sectionTitles.en[String(section.number)] = section.translation;

  for (const group of section.chapterGroup.detail) {
    groupTitles.ta[String(group.number)] = group.name;
    groupTitles.en[String(group.number)] = group.translation;

    for (const chapter of group.chapters.detail) {
      chapterTitles.ta[String(chapter.number)] = chapter.name;
      chapterTitles.en[String(chapter.number)] = chapter.translation;
    }
  }
}

function writeJson(fileName, data) {
  fs.writeFileSync(path.join(__dirname, 'data', fileName), JSON.stringify(data, null, 2) + '\n', 'utf8');
}

writeJson('section_titles_ta.json', sectionTitles.ta);
writeJson('section_titles_en.json', sectionTitles.en);
writeJson('group_titles_ta.json', groupTitles.ta);
writeJson('group_titles_en.json', groupTitles.en);
writeJson('chapter_titles_ta.json', chapterTitles.ta);
writeJson('chapter_titles_en.json', chapterTitles.en);

console.log('Extracted title files:');
console.log('  section_titles_ta.json:', Object.keys(sectionTitles.ta).length, 'entries');
console.log('  section_titles_en.json:', Object.keys(sectionTitles.en).length, 'entries');
console.log('  group_titles_ta.json:', Object.keys(groupTitles.ta).length, 'entries');
console.log('  group_titles_en.json:', Object.keys(groupTitles.en).length, 'entries');
console.log('  chapter_titles_ta.json:', Object.keys(chapterTitles.ta).length, 'entries');
console.log('  chapter_titles_en.json:', Object.keys(chapterTitles.en).length, 'entries');
