const express = require('express')
const { parseDocx, deleteFile, exportYAML } = require("../parser")
const { buildAuthorsMap, initializeServer, parseSuppMats } = require("../utils")
const { createPaper, getAllPapers, getPaperByTitle, getAllPapersBySession } = require("../database/papers")

const uploadMiddleware = multer({ storage: multer.diskStorage({ destination: "./tmp"}) })

const router = express.Router()

router.get('/', async function (req, res) {
  try {
      const { SessionId } = req.query

      let papers
      if (SessionId) {
          // Filter by the query parameter
          papers = await getAllPapersBySession(SessionId)
      } else {
          papers = await getAllPapers()
      }

      res.json(papers)
  } catch (err) {
      console.error(err)
      res.sendStatus(500)
  }
})


router.post("/", uploadMiddleware.any(), async function (req, res) {
  try {
      if (!req.files) {
          console.error("File(s) missing!")
          res.status(400).send("Bad Request")
      }

      const title = req.body.title
      delete req.body.title

      const authors = buildAuthorsMap(req.body)
      const abstractFileName = req.files[0].filename

      const inputFilePath = req.files[0].path
      const outputFilePath = path.join(__dirname, 'tmp', `${abstractFileName}.html`)

      const fileBuffer = await parseDocx(inputFilePath, outputFilePath)
      const abstractHTML = fileBuffer.toString('utf8')

      const suppMats = parseSuppMats(req.files, req.body)

      await createPaper(title, authors, abstractHTML, suppMats)

      await deleteFile(outputFilePath)
      await deleteFile(inputFilePath)

      res.sendStatus(200)
  } catch (err) {
      console.error(err)
      res.status(500).send("Internal Server Error")
  }
})

router.post("/abstract", uploadMiddleware.single("abstract"), async function (req, res) {
  try {
      if (!req.file) {
          console.error("File missing!")
          res.status(400).send("Bad Request")
      }

      const fileName = req.file.filename

      const inputFilePath = req.file.path
      const outputFilePath = path.join(__dirname, 'tmp', `${fileName}.html`)

      const fileBuffer = await parseDocx(inputFilePath, outputFilePath)
      const abstractHTML = fileBuffer.toString('utf8')

      res.json({
          html: abstractHTML,
      })

      await deleteFile(outputFilePath)
      await deleteFile(inputFilePath)
  } catch (err) {
      console.error(err)
      res.status(500).send("Internal Server Error")
  }
})

module.exports = router