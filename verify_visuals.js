const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const artifactDir = 'C:\\Users\\ravia\\.gemini\\antigravity-ide\\brain\\1fbe5234-1e35-4c84-bad5-d28126eb3c4b';
const htmlPath = 'file:///' + path.resolve(__dirname, 'public', 'index.html').replace(/\\/g, '/');

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  console.log('Navigating to:', htmlPath);
  await page.goto(htmlPath);
  await page.waitForTimeout(500);

  // 1. Closed Cover
  await page.screenshot({ path: path.join(artifactDir, 'state_1_cover_closed.png') });
  console.log('Captured state 1: Cover closed');

  // 2. Open TOC (Page turn 1)
  await page.click('#nextBtn');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(artifactDir, 'state_2_toc_open.png') });
  console.log('Captured state 2: TOC open');

  // 3. Full Reading Spread (Page turn 2 - Tamil Left, EN Translation Right)
  await page.click('#nextBtn');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(artifactDir, 'state_3_reading_spread.png') });
  console.log('Captured state 3: Reading spread (Desktop 1280x800)');

  // 4. Synchronized Expanded Kural (Click Kural #1)
  await page.locator('.krow[data-i="0"]').first().click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(artifactDir, 'state_4_expanded_kural.png') });
  console.log('Captured state 4: Synchronized expanded kural #1');

  // 5. DE/EN Language Toggle (German)
  await page.click('#btnDE');
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(artifactDir, 'state_5_de_toggle.png') });
  console.log('Captured state 5: German language toggle');

  // Switch back to EN
  await page.click('#btnEN');
  await page.waitForTimeout(300);

  // 6. Drag Mid-Flip Interaction Simulation
  const bookBox = await page.locator('#book').boundingBox();
  if (bookBox) {
    const startX = bookBox.x + bookBox.width * 0.9;
    const startY = bookBox.y + bookBox.height * 0.9;
    const endX = bookBox.x + bookBox.width * 0.6;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, startY, { steps: 10 });
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(artifactDir, 'state_6_mid_flip_drag.png') });
    await page.mouse.up();
    console.log('Captured state 6: Mid-flip drag motion');
  }

  // 7. Mobile Viewport (390x844)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(artifactDir, 'state_7_mobile_view.png') });
  console.log('Captured state 7: Mobile view (390x844)');

  // 8. Closed Back Cover at End
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.click('#nextBtn');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(artifactDir, 'state_8_cover_back_closed.png') });
  console.log('Captured state 8: Closed back cover');

  await browser.close();
  console.log('Visual verification capture complete!');
})();
