import * as functions from "firebase-functions"
import { scrapeWabPage, scrapeNews } from "./Controllers"
import * as express from "express"
import * as bodyParser from "body-parser"
const app = express()
app.use(bodyParser.json({ type: "application/json" }))

app.get("/news", async (req, res) => {
  const stories = await scrapeWabPage()
  console.log(stories)
  const indianExpressNews = await scrapeNews()

  res.json({ "India today": stories, "Indian Express": indianExpressNews })
})
exports.api = functions
  .runWith({
    timeoutSeconds: 300,
    memory: "256MB" || "2GB",
  })
  .region("us-east1")
  .https.onRequest(app)
