const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'verification');
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const url = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');

  await page.goto(url);
  await page.waitForTimeout(600);

  const counts = await page.evaluate(() => ({
    chapters: DATA.chapters.length,
    kurals: DATA.chapters.reduce((sum, chapter) => sum + chapter.kurals.length, 0),
    pages: pages.length,
    leaves: document.querySelectorAll('.leaf').length,
    tocLists: document.querySelectorAll('.toc-list').length,
    tocItems: document.querySelectorAll('.toc-item').length,
    languageControls: document.querySelectorAll('[data-lang-option]').length
  }));

  if (counts.chapters !== 133) throw new Error(`Expected 133 chapters, found ${counts.chapters}`);
  if (counts.kurals !== 1330) throw new Error(`Expected 1330 kurals, found ${counts.kurals}`);
  if (counts.tocLists !== 2) throw new Error(`Expected 2 TOC lists, found ${counts.tocLists}`);
  if (counts.tocItems !== 266) throw new Error(`Expected 266 TOC items across both pages, found ${counts.tocItems}`);
  if (counts.languageControls !== 2) throw new Error(`Expected EN/DE controls, found ${counts.languageControls}`);

  await page.screenshot({ path: path.join(outDir, '01-cover-desktop.png') });
  await page.click('#nextBtn');
  await page.waitForTimeout(550);
  await page.screenshot({ path: path.join(outDir, '02-toc-desktop.png') });

  await page.selectOption('#chapterSelect', '1');
  await page.waitForTimeout(500);
  const layout = await page.evaluate(() => {
    const list = document.querySelector('.leaf[style*="block"] .kural-list');
    const rows = Array.from(list.querySelectorAll('.kural-row'));
    const rect = list.getBoundingClientRect();
    const visibleRows = rows.filter((row) => {
      const r = row.getBoundingClientRect();
      return r.bottom <= rect.bottom + 1 && r.top >= rect.top - 1;
    });
    const firstTocItem = document.querySelector('.toc-item');
    const titleSpan = firstTocItem ? firstTocItem.querySelector('span:nth-child(2)') : null;
    return {
      visibleRows: visibleRows.length,
      tocSingleLine: titleSpan ? titleSpan.scrollWidth <= titleSpan.clientWidth + 1 : null
    };
  });
  if (layout.visibleRows !== 10) throw new Error(`Expected 10 visible kural rows, found ${layout.visibleRows}`);
  if (layout.tocSingleLine === false) throw new Error('TOC entry text wraps onto multiple lines');

  await page.selectOption('#chapterSelect', '133');
  await page.waitForTimeout(600);
  const status = await page.locator('#pageInfo').textContent();
  if (!status.includes('133')) throw new Error(`Chapter jump failed: ${status}`);

  await page.locator('.leaf[style*="block"] .kural-row[data-kural="1321"]').first().click();
  await page.waitForTimeout(250);
  const expansion = await page.evaluate(() => {
    const visibleRows = Array.from(document.querySelectorAll('.leaf[style*="block"] .kural-row'));
    const openRows = visibleRows.filter((row) => row.classList.contains('open'));
    return {
      openCount: openRows.length,
      openKurals: openRows.map((row) => row.dataset.kural),
      openDescriptions: openRows.filter((row) => getComputedStyle(row.querySelector('.kural-desc')).display !== 'none').length
    };
  });
  if (expansion.openCount !== 2 || !expansion.openKurals.every((number) => number === '1321')) {
    throw new Error(`Expected matching Tamil and translation descriptions for kural 1321, found ${JSON.stringify(expansion)}`);
  }
  if (expansion.openDescriptions !== 2) throw new Error(`Expected two visible descriptions, found ${expansion.openDescriptions}`);

  await page.locator('[data-lang-option="de"]').click();
  const deRow = page.locator('.leaf[style*="block"] .translation-row.open').first();
  const deVisibleText = await deRow.locator('.lang-de').first().textContent();
  const englishText = await deRow.locator('.lang-en').first().textContent();
  const englishVisible = await deRow.locator('.lang-en').first().isVisible();
  if (!deVisibleText || deVisibleText.trim() === '' || deVisibleText.includes('Deutsche Fassung folgt.')) {
    throw new Error(`German translated text was not visible after selecting DE: ${deVisibleText}`);
  }
  if (englishVisible || deVisibleText === englishText) {
    throw new Error('English content is still visible in DE mode');
  }

  await page.screenshot({ path: path.join(outDir, '03-chapter-133-desktop.png') });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, '04-chapter-133-mobile.png') });

  await browser.close();
  console.log(JSON.stringify(counts, null, 2));
  console.log(`Screenshots written to ${outDir}`);
})();
