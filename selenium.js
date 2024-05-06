import { Builder, Browser } from "selenium-webdriver";

(async function helloSelenium() {
  let driver = await new Builder().forBrowser(Browser.CHROME).build();

  await driver.get("https://jaka.if21pwa.com");

  driver.findElements("body > header");

  await driver.quit();
})();
