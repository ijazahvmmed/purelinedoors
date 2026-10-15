import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const progress = (page: Page) => page.locator('.entrance-experience').getAttribute('data-progress').then(Number);
const ready = async (page: Page) => {
  await page.goto('/');
  await page.locator('.entrance-setting').scrollIntoViewIfNeeded();
  await expect(page.locator('.entrance-experience')).toHaveAttribute('data-ready','true');
};
const angle = (page: Page) => page.locator('.entrance-leaf').evaluate(el => {
  const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
  return Math.atan2(m.m31,m.m11)*180/Math.PI;
});

test.beforeEach(async ({page}) => { await page.addInitScript(() => localStorage.setItem('pureline-consent','essential')); });

test('Arch pivots at its right hinges, tracks real dragging and reverses without a click leaking through', async ({page}) => {
  await page.setViewportSize({width:1440,height:1000});
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await ready(page);
  const section = page.locator('.entrance-experience');
  expect(await section.evaluate(el => el.previousElementSibling?.classList.contains('collections') && el.nextElementSibling?.classList.contains('home-benefits'))).toBe(true);
  await expect(page.locator('.entrance-editorial .button')).toHaveAttribute('href','/doors/exterior-grp');
  const door = page.locator('.entrance-hit-area');
  const leaf = page.locator('.entrance-leaf');
  const box = (await door.boundingBox())!;
  const origin = await leaf.evaluate(el => getComputedStyle(el).transformOrigin.split(' ').map(parseFloat));
  expect(origin[0]).toBeCloseTo(box.width,1);
  expect(origin[1]).toBeCloseTo(box.height/2,1);
  expect(await angle(page)).toBeCloseTo(0);
  await page.mouse.move(box.x+box.width*.12,box.y+box.height*.56);
  await page.mouse.down();
  await page.mouse.move(box.x+box.width*.52,box.y+box.height*.56,{steps:24});
  expect(await progress(page)).toBeCloseTo(.5,1);
  expect(await angle(page)).toBeCloseTo(-41,0);
  const half = (await leaf.boundingBox())!;
  // The fixed right hinge remains at the aperture edge while the left edge recedes.
  expect(Math.abs(half.x+half.width-(box.x+box.width))).toBeLessThan(2);
  expect(half.width).toBeLessThan(box.width*.8);
  await page.mouse.move(box.x+box.width*1.2,box.y+box.height*.56,{steps:24});
  await page.mouse.up();
  await expect.poll(()=>progress(page)).toBe(1);
  await expect.poll(()=>angle(page)).toBeCloseTo(-82,0);
  await expect(leaf).toHaveCSS('opacity','1'); // This is geometry, not a disappearing door.
  await expect(page.locator('.entrance-copy-open')).toHaveCSS('opacity','1');
  await expect(page.locator('.entrance-copy-closed')).toHaveCSS('opacity','0');
  await expect(page.locator('.entrance-interior-shade')).toHaveCSS('opacity','0.04');
  await expect(page.getByRole('status').filter({hasText:'Door open.'})).toBeVisible();
  // Dragging beyond either limit stays bounded, and the release click does not reopen.
  await page.mouse.move(box.x+box.width*.9,box.y+box.height*.55);
  await page.mouse.down();
  await page.mouse.move(box.x-box.width,box.y+box.height*.55,{steps:24});
  expect(await progress(page)).toBe(0);
  await page.mouse.up();
  await expect.poll(()=>progress(page)).toBe(0);
  await door.focus();
  await page.keyboard.press('End'); await expect.poll(()=>progress(page)).toBe(1);
  await page.keyboard.press('Space'); await expect.poll(()=>progress(page)).toBe(0);
  await page.keyboard.press('ArrowRight'); await expect.poll(()=>progress(page)).toBe(.125);
  await page.keyboard.press('Home'); await expect.poll(()=>progress(page)).toBe(0);
  const slider = page.getByRole('slider',{name:'Door opening'});
  await slider.focus(); await page.keyboard.press('End');
  await expect.poll(()=>progress(page)).toBe(1);
  await expect(slider).toHaveAttribute('aria-valuetext','Fully open');
  const violations = (await new AxeBuilder({page}).include('.entrance-experience').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations;
  expect(violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  await page.locator('.entrance-editorial .button').click();
  await expect(page).toHaveURL(/\/doors\/exterior-grp$/);
  await page.goBack(); await expect(page.locator('.entrance-experience')).toHaveAttribute('data-ready','true');
  await page.locator('.entrance-action').click(); await expect.poll(()=>progress(page)).toBe(1);
  expect(errors).toEqual([]);
});

test('touch taps and swipes open and close; vertical gestures keep native page scrolling', async ({browser}) => {
  const context = await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  await context.addInitScript(() => localStorage.setItem('pureline-consent','essential'));
  const page = await context.newPage();
  try {
    await ready(page);
    const door=page.locator('.entrance-hit-area');
    await expect(door).toHaveCSS('touch-action','pan-y');
    await door.tap(); await expect.poll(()=>progress(page)).toBe(1);
    await door.tap(); await expect.poll(()=>progress(page)).toBe(0);
    const cdp = await context.newCDPSession(page);
    const swipe = async (horizontal: boolean, reverse = false) => {
      await door.scrollIntoViewIfNeeded();
      const b=(await door.boundingBox())!;
      const x=b.x+b.width*(reverse ? .9 : .1),y=b.y+b.height*.58;
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
      for(let i=1;i<=18;i++) {
        await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:horizontal?x+b.width*.8*(reverse?-1:1)*i/18:x,y:horizontal?y:y-145*i/18}]});
        await page.waitForTimeout(12);
      }
      await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    };
    await swipe(true); await expect.poll(()=>progress(page)).toBe(1);
    await swipe(true,true); await expect.poll(()=>progress(page)).toBe(0);
    const before = await page.evaluate(()=>scrollY);
    await swipe(false);
    await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(before+30);
    await expect.poll(()=>progress(page)).toBe(0);
  } finally { await context.close(); }
});

test('responsive composition and runtime reduced motion use a crossfade with no rotating leaf', async ({page}) => {
  for(const width of [320,390,768,1024,1440,1920]) {
    await page.setViewportSize({width,height:1000});
    await ready(page);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    const portal=(await page.locator('.entrance-portal').boundingBox())!;
    const setting=(await page.locator('.entrance-setting').boundingBox())!;
    expect(portal.x).toBeGreaterThan(setting.x+10);
    expect(portal.x+portal.width).toBeLessThan(setting.x+setting.width-10);
    expect(portal.width/portal.height).toBeCloseTo(596/1214,3);
    await page.locator('.entrance-action').click();
    await page.emulateMedia({reducedMotion:'reduce'});
    await expect(page.locator('.entrance-experience')).toHaveAttribute('data-reduced','true');
    await expect.poll(()=>progress(page)).toBe(1);
    expect(await angle(page)).toBeCloseTo(0);
    await expect(page.locator('.entrance-leaf')).toHaveCSS('opacity','0');
    await page.locator('.entrance-action').click();
    await expect.poll(()=>progress(page)).toBe(0);
    await expect(page.locator('.entrance-leaf')).toHaveCSS('opacity','1');
    await page.emulateMedia({reducedMotion:'no-preference'});
    await expect(page.locator('.entrance-experience')).toHaveAttribute('data-reduced','false');
  }
});

test('motion preference changes during a captured drag release the gesture and rapid reversal honours the final intent', async ({page}) => {
  await page.setViewportSize({width:1440,height:1000});
  await ready(page);
  const door=page.locator('.entrance-hit-area');
  const b=(await door.boundingBox())!;
  await page.mouse.move(b.x+b.width*.1,b.y+b.height*.55);
  await page.mouse.down();
  await page.mouse.move(b.x+b.width*.66,b.y+b.height*.55,{steps:12});
  await expect(page.locator('.entrance-experience')).toHaveAttribute('data-dragging','true');
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(page.locator('.entrance-experience')).toHaveAttribute('data-dragging','false');
  await page.mouse.up();
  await expect.poll(()=>progress(page)).toBe(1);
  await expect(page.locator('.entrance-leaf')).toHaveCSS('opacity','0');
  await page.emulateMedia({reducedMotion:'no-preference'});
  for(let i=0;i<3;i++) { await page.locator('.entrance-action').click(); await page.waitForTimeout(85); }
  await expect.poll(()=>progress(page)).toBe(0);
  await expect(page.locator('.entrance-leaf')).toHaveCSS('opacity','1');
  expect(await angle(page)).toBeCloseTo(0);
});

test('without JavaScript the native reveal and collection link remain usable', async ({browser}) => {
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();
  try {
    await page.goto('/');
    const fallback=page.locator('.entrance-fallback');
    await fallback.locator('summary').click();
    await expect(fallback).toHaveAttribute('open','');
    await expect(page.locator('.entrance-leaf')).toHaveCSS('opacity','0');
    await expect(page.locator('.entrance-copy-open')).toHaveCSS('opacity','1');
    await fallback.locator('summary').click();
    await expect(page.locator('.entrance-leaf')).toHaveCSS('opacity','1');
    await expect(page.locator('.entrance-editorial .button')).toHaveAttribute('href','/doors/exterior-grp');
  } finally { await context.close(); }
});
