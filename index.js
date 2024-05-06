import { chromium } from "playwright";
import { writeFile } from "fs";
import { parse } from "node-html-parser";

async function writeDataToFile(filename, data) {
  try {
    await writeFile(filename, data);
    console.log("Data has been written to file successfully.");
  } catch (err) {
    console.error("Error writing to file:", err);
  }
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto("https://jaka.if21pwa.com", {
      waitUntil: "networkidle",
    });

    const stringHtml = await page.content();
    const dom = parse(
      '<html lang="id">  <head>    <title>Jaka - Teman Jajanmu di Kampus</title>  </head>  <body>    <header class="poppins">      <section></section>      <nav class="middle-nav">        <ul>          <li><a href="">APAAN NIH</a></li>          <li><a href="">DETAIL CUAN</a></li>          <li><a href="">INFO</a></li>        </ul>      </nav>      <nav class="end-nav"></nav>    </header>    <section class="hero">      <section class="title krona">        <h1>JAKA</h1>        <h4>Teman Jajanmu di Kampus</h4>      </section>      <section class="download">        <button>DOWNLOAD NOW</button>      </section>      </section>  </body></html>'
    );
    console.log(dom.querySelector(".poppins"));
    writeFile("scrap.html", stringHtml, (err) => {
      if (err) {
        console.error("Error writing to file:", err);
        return;
      }
      console.log("Data has been written to file successfully.");
    });
  } catch (error) {
    console.error("An error occurred:", error.message);
  } finally {
    await page.close();
    await browser.close();
  }
})();
