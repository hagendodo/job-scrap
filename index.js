import { chromium } from "playwright";
import { writeFile } from "fs/promises"; // Updated to use promises version of fs
import { parse } from "node-html-parser";
import { v4 } from "uuid";

async function writeDataToFile(filename, data) {
  try {
    await writeFile(`output_jobs/${filename}.html`, data);
    console.log("Status: Success");
    console.log(
      `Message: Data output_jobs/${filename}.html has been written to file successfully.`
    );
  } catch (err) {
    throw new Error(err);
  }
}

function getRandomDelay(minDelay, maxDelay) {
  // Generate a random delay between minDelay and maxDelay (inclusive)
  return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
}

(async () => {
  const args = process.argv.slice(2); // Extracting command-line arguments excluding node and script name
  if (args.length !== 1) {
    console.error("Usage: npm run scrap <URL>");
    process.exit(1);
  }

  const url = args[0];

  const startTime = new Date(); // Record start time

  const browser = await chromium.launch({ headless: true }); // Headful mode might reduce detection
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
    javaScriptEnabled: true,
  });

  // Overriding the navigator properties to make the bot less detectable
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", {
      get: () => false,
    });
    Object.defineProperty(navigator, "platform", {
      get: () => "Win32",
    });
  });

  const page = await context.newPage();

  // Function to delay actions
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const randomDelay = getRandomDelay(2000, 7000);

  try {
    await page.goto(url, {
      waitUntil: "networkidle",
    });

    // Adding a delay to mimic human behavior
    await delay(randomDelay);

    const stringHtml = await page.content();
    const dom = parse(stringHtml);
    const jobList = dom.querySelector('[aria-label="Jobs List"]');
    if (jobList) {
      const links = jobList
        .querySelectorAll("li")
        .map((link) => link.outerHTML);

      await writeDataToFile(v4(), links.join("\n"));
    } else {
      console.error("Jobs List not found.");
    }
  } catch (error) {
    console.log("Status: Failed");
    console.error("Message:", error.message);
  } finally {
    await page.close();
    await browser.close();

    const endTime = new Date(); // Record end time
    const executionTime = endTime - startTime; // Calculate execution time
    console.log(`Execution time: ${executionTime / 1000}s`);
  }
})();
