const path = require('path')
const express = require("express")
const bodyParser = require("body-parser")
const fs = require("fs")
const multer = require("multer")

const uploadMiddleware = multer({ storage: multer.diskStorage({ destination: "./tmp"}) })

const { parseDocx, deleteFile, exportYAML } = require("./src/parser.js")
const { buildAuthorsMap, initializeServer } = require("./src/utils")
const authRoutes = require('./src/routes/auth')

const server = express()

server.use(bodyParser.json())

server.get("/", async function(req, res) {
    const html = fs.readFileSync("./public/index.html")
    res.send(html.toString())
})

// This loads in the routes from the router in authRoutes, as if they were defined directly here at /api/auth
server.use("/api/auth", authRoutes)

server.post("/api/papers", uploadMiddleware.single("abstract"), async function (req, res) {
    try {
        if (!req.file) {
            console.error("File missing!")
            res.status(400).send("Bad Request")
        }

        const title = req.body.title
        delete req.body.title

        const authors = buildAuthorsMap(req.body)
        const fileName = req.file.filename

        const inputFilePath = req.file.path
        const outputFilePath = path.join(__dirname, 'tmp', `${fileName}.html`)

        const fileBuffer = await parseDocx(inputFilePath, outputFilePath)
        const abstractHTML = fileBuffer.toString('utf8')

        await exportYAML(title, authors, abstractHTML)

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

server.post("/api/papers/materials", async function (req, res) {
    // Placeholder for the future supplementary materials route
    res.send("OK")
})

server.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
server.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
server.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
server.use(express.static("public"))

// Protected authenticated routing

server.listen(8080, () => {
    initializeServer(__dirname)
    console.log("Listening on port 8080")
})