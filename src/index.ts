import * as functions from "firebase-functions";
import scrapeWabPage from "./Controllers";

exports.scrapeNews = functions.runWith({
  timeoutSeconds: 240,
  memory: "256MB"||'1GB',
}).region("us-east1").https.onRequest(async(req,res)=>{
  const stories = await scrapeWabPage()
  res.type("html").send(stories.join("<br>"))
})