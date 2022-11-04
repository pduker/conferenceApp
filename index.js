const path = require('path')
const express = require("express")
const bodyParser = require("body-parser")
const fs = require("fs")
const multer = require("multer")

const { parseDocx, deleteFile, exportYAML } = require("./src/parser.js")
const { buildAuthorsMap, initializeServer, parseSuppMats, fileNameGenerator} = require("./src/utils")

const uploadMiddleware = multer({ storage: multer.diskStorage({ destination: "./tmp", filename: fileNameGenerator}) })

const server = express()

server.use(bodyParser.json())

server.get("/", async function(req, res) {
    const html = fs.readFileSync("./public/index.html")
    res.send(html.toString())
})

server.post("/api/papers", uploadMiddleware.any(), async function (req, res) {
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

        await exportYAML(title, authors, abstractHTML, suppMats)

        await deleteFile(outputFilePath)
        await deleteFile(inputFilePath)

        res.sendStatus(200)
    } catch (err) {
        console.error(err)
        res.status(500).send("Internal Server Error")
    }
})

server.post("/api/papers/abstract", uploadMiddleware.single("abstract"), async function (req, res) {
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


server.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
server.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
server.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
server.use(express.static("public"))

server.listen(8080, () => {
    initializeServer(__dirname)
    console.log("Listening on port 8080")
})