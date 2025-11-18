import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

interface Thresholds {
  LCP: number; // seconds
  CLS: number; // unitless
  INP?: number; // seconds
}

interface Results {
  LCP: number;
  CLS: number;
  INP: number;
}

const runLighthouse = async (url: string, thresholds: Thresholds): Promise<void> => {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = { port: chrome.port };

  try {
    const runnerResult = await lighthouse(url, options);
    const lhr = runnerResult?.lhr;

    const results: Results = {
      LCP: lhr?.audits['largest-contentful-paint']?.numericValue !== undefined
        ? lhr.audits['largest-contentful-paint'].numericValue / 1000
        : 0,
      CLS: lhr?.audits['cumulative-layout-shift']?.numericValue !== undefined
        ? lhr.audits['cumulative-layout-shift'].numericValue
        : 0,
      INP: lhr?.audits['experimental-interaction-to-next-paint']?.numericValue !== undefined
        ? lhr.audits['experimental-interaction-to-next-paint'].numericValue / 1000
        : 0
    };

    console.log('Audit results:', results);

    let failed = false;

    for (const metric of Object.keys(thresholds) as Array<keyof Thresholds>) {
      if (results[metric] > thresholds[metric]!) {
        console.error(`${metric} failed: ${results[metric]} > ${thresholds[metric]}`);
        failed = true;
      } else {
        console.log(`${metric} passed: ${results[metric]} <= ${thresholds[metric]}`);
      }
    }

    if (failed) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Lighthouse audit failed:', error);
    process.exit(1);
  } finally {
    chrome.kill();
  }
};

// Example usage:
const url = 'https://example.com';
const thresholds: Thresholds = {
  LCP: 2.5,
  CLS: 0.1,
  INP: 0.2 // 200 ms
};

runLighthouse(url, thresholds);
