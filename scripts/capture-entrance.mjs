import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const url = process.env.PURELINE_PREVIEW_URL || 'http://127.0.0.1:3001';
await mkdir('docs/previews/entrance', { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  for (const [name, width, height] of [['desktop',1440,1050],['mobile',390,844]]) {
    const context = await browser.newContext({ viewport: {width,height}, hasTouch: name === 'mobile', isMobile: name === 'mobile', recordVideo: {dir:'tmp/entrance-video',size:{width,height}} });
    await context.addInitScript(() => localStorage.setItem('pureline-consent','essential'));
    const page = await context.newPage();
    const video = page.video();
    await page.goto(url);
    const section = page.locator('.entrance-experience');
    await section.scrollIntoViewIfNeeded();
    if(name==='mobile') await page.locator('.entrance-setting').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1100);
    await section.screenshot({path:`docs/previews/entrance/${name}-closed.png`});
    const door = page.locator('.entrance-hit-area');
    const bounds = await door.boundingBox();
    if(name==='desktop') {
      await page.mouse.move(bounds.x+bounds.width*.12,bounds.y+bounds.height*.56);
      await page.mouse.down();
      await page.mouse.move(bounds.x+bounds.width*.52,bounds.y+bounds.height*.56,{steps:35});
      await page.waitForTimeout(150);
      await section.screenshot({path:`docs/previews/entrance/${name}-half.png`});
      await page.mouse.move(bounds.x+bounds.width*.98,bounds.y+bounds.height*.56,{steps:35});
      await page.mouse.up();
    } else await door.tap();
    await page.waitForTimeout(1400);
    await section.screenshot({path:`docs/previews/entrance/${name}-open.png`});
    await page.waitForTimeout(600);
    if(name==='mobile') await door.tap();
    else { await door.focus(); await page.keyboard.press('Home'); }
    await page.waitForTimeout(1400);
    await context.close();
    await video.saveAs(`docs/previews/entrance/${name}.webm`);
  }
} finally { await browser.close(); }
