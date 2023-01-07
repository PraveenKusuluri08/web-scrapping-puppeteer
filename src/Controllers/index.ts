import * as puppeteer from "puppeteer"

const scrapeWabPage = async () => {
  let stories:Array<any> =[] 
  const browser = await puppeteer.launch({
    headless: true,
    timeout: 20000,
    ignoreHTTPSErrors: true,
    slowMo: 0,
    args: [
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-first-run",
      "--no-sandbox",
      "--no-zygote",
      "--window-size=1280,720",
    ],
  })
  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 820 })
    await page.setRequestInterception( true );
    page.on("request", (interceptedRequest) => {
      const blockResources = ["script", "stylesheet", "image", "media", "font"]
      if (blockResources.includes(interceptedRequest.resourceType())) {
        interceptedRequest.abort()
      } else {
        interceptedRequest.continue()
      }
    })
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:53.0) Gecko/20100101 Firefox/53.0"
    )
    await page.goto("https://www.indiatoday.in/", {
      waitUntil: "domcontentloaded",
    })
    const articleSelector = "article.B1S3_story__card__A_fhi"
    stories = await page.$$eval(articleSelector, (articles) => {
      return articles
        .slice(0, 10)
        .map((div, index) =>{
          return `${index + 1}.${div.innerText.split("\n")[1]}`})
    })
  } catch (err) {
    console.log(err)
  } finally {
    await browser.close()
  }
  return stories
}

export default scrapeWabPage
