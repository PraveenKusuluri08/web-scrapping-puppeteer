import * as puppeteer from "puppeteer"

const scrapeWabPage = async () => {
  // india today
  let stories:any ={}
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
    const articleLinks = "article.B1S3_story__card__A_fhi div.B1S3_story__thumbnail___pFy6"
    stories["NewsTitles"] = await page.$$eval(articleSelector,(news)=>{
      return news.slice(0,10).map((div,index)=>`${index+1}.) ${div.innerText}`)
    })
    stories["NewsLinks"]= await page.$$eval(articleLinks,(links)=>{

      return links.slice(0,10).map((div,index)=>{
        return `${index+1}.) ${div.getElementsByTagName("a").item(0)}`
      })           
    })
  } catch (err) {
    console.log(err)
  } finally {
    await browser.close()
  }
  return stories
}

//indian express
const scrapeNews=async ()=>{
  let stories:any ={}
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
  try{
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 820 })
    await page.setRequestInterception( true );
    page.on("request", (interceptedRequest) => {
      const blockResources = ["script", "stylesheet", "image", "media"]
      if (blockResources.includes(interceptedRequest.resourceType())) {
        interceptedRequest.abort()
      } else {
        interceptedRequest.continue()
      }
    })
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:53.0) Gecko/20100101 Firefox/53.0"
    )
    await page.goto("https://indianexpress.com/",{
      waitUntil: "domcontentloaded",
    })
    const sectionViewerLatestNews="div.lead-stories div.right-part li"
    const otherArticles = "div.lead-stories div.other-article"
    stories["otherArticles"]=await page.$$eval(otherArticles,(articles)=>{
      return articles.slice(0,10).map((div,index)=>{
        return `${index+1}.${div.innerText}`
      })
    })
    stories["otherArticlesLinks"]=await page.$$eval(otherArticles,(articles)=>{
      return articles.slice(0,10).map((div,index)=>{
        return `${index+1}.${div.getElementsByTagName("a").item(0)}`
      })
    })
    stories["latestNews"] = await page.$$eval(sectionViewerLatestNews, (articles) => {
      return articles
        .slice(0, 20)
        .map((div, index) =>{
          return `${index + 1}.${div.innerText}`})
    })
    stories["latestNewsLinks"]= await page.$$eval(sectionViewerLatestNews,(latestNewsLinks)=>{
      return latestNewsLinks.slice(0,20).map((div,index)=>{
        return `${index+1}.${div.getElementsByTagName("a").item(0)}`
      })
    })
  }catch(err){
    console.log(err);
    
  }finally{
    browser.close()
  }
  return stories
}


export {scrapeWabPage,scrapeNews}
