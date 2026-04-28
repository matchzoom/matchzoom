import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const BASE_URL = process.env.PERF_BASE_URL ?? 'http://localhost:3000';
const SCREENSHOTS_DIR = 'docs/perf/screenshots';

async function selectMode(page, mode) {
  const label = mode === 'virtual' ? '가상 스크롤' : '일반 렌더링';
  await page.evaluate((l) => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const target = buttons.find((b) => b.textContent?.trim() === l);
    target?.click();
  }, label);
  await page.waitForTimeout(800);
}

async function setupLongTaskObserver(page) {
  await page.evaluate(() => {
    window.__longTasks = [];
    try {
      const obs = new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          window.__longTasks.push(e.duration);
        }
      });
      obs.observe({ entryTypes: ['longtask'] });
      window.__longTaskObserver = obs;
    } catch {}
  });
}

async function captureMetrics(page) {
  return page.evaluate(() => {
    const list = document.querySelector('[role="list"]');
    return {
      itemsLoaded: document.querySelectorAll('[role="listitem"]').length,
      domTotal: document.querySelectorAll('*').length,
      domList: list ? list.querySelectorAll('*').length : 0,
      longTaskCount: (window.__longTasks ?? []).length,
      longTaskTotalMs: (window.__longTasks ?? []).reduce((a, b) => a + b, 0),
      longTaskMaxMs:
        (window.__longTasks ?? []).length > 0
          ? Math.max(...window.__longTasks)
          : 0,
    };
  });
}

async function takeScreenshots(page, mode) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({
    path: join(SCREENSHOTS_DIR, `${mode}-top.png`),
    fullPage: false,
  });

  const headerBox = await page.locator('div.sticky.top-0').first().boundingBox();
  if (headerBox) {
    await page.screenshot({
      path: join(SCREENSHOTS_DIR, `${mode}-metrics.png`),
      clip: {
        x: 0,
        y: 0,
        width: headerBox.width,
        height: headerBox.height + headerBox.y + 130,
      },
    });
  }
}

async function scrollUntilStable(page) {
  let prev = -1;
  let stable = 0;
  for (let i = 0; i < 200; i++) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    const len = await page.evaluate(
      () => document.querySelectorAll('[role="listitem"]').length,
    );
    if (len === prev) {
      if (++stable >= 6) break;
    } else {
      stable = 0;
    }
    prev = len;
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  console.log('▶ navigating to /perf');
  await page.goto(`${BASE_URL}/perf`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[role="list"]', { timeout: 30_000 });

  // 1. plain 모드로 1000개 다 로드
  console.log('▶ loading all items in plain mode...');
  await selectMode(page, 'plain');
  await setupLongTaskObserver(page);
  await scrollUntilStable(page);
  const plain = await captureMetrics(page);
  console.log('plain:', plain);
  await takeScreenshots(page, 'plain');

  // 2. virtual 모드로 토글 — 데이터는 React Query 캐시에 유지됨
  console.log('▶ switching to virtual mode...');
  await page.evaluate(() => (window.__longTasks = []));
  await selectMode(page, 'virtual');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  const virtual = await captureMetrics(page);
  console.log('virtual:', virtual);
  await takeScreenshots(page, 'virtual');

  await browser.close();

  const result = {
    measuredAt: new Date().toISOString(),
    viewport: { width: 1280, height: 800 },
    note: 'plain 모드에서 1000개 다 로드한 후 virtual로 토글하여 측정. 데이터는 React Query 캐시에 유지됨.',
    virtual,
    plain,
    domReductionPct:
      plain.domTotal > 0
        ? +(((plain.domTotal - virtual.domTotal) / plain.domTotal) * 100).toFixed(1)
        : 0,
  };

  await writeFile(
    'docs/perf/results.json',
    JSON.stringify(result, null, 2) + '\n',
  );
  console.log('✓ results saved to docs/perf/results.json');
  console.log(`✓ DOM reduction: ${result.domReductionPct}%`);
})();
