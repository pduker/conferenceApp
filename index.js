const path = require('path')
const express = require("express")
const bodyParser = require("body-parser")
const fs = require("fs")
const multer = require("multer")

const uploadMiddleware = multer({ storage: multer.diskStorage({ destination: "./tmp"}) })

const { parseDocx, deleteFile } = require("./src/parser.js")

const server = express()

server.use(bodyParser.json())

server.get("/", async function(req, res) {
    const html = fs.readFileSync("./public/index.html")
    res.send(html.toString())
})

server.post("/api/papers", uploadMiddleware.single("abstract"), async function (req, res) {
    try {
        if (!req.file) {
            console.error("File missing!")
            res.status(400).send("Bad Request")
        }

        const authors = []

        for (const [key, value] of Object.entries(req.body)) {
            
        }

        console.log(req.file)
        console.log(req.body)
        const fileName = req.file.filename

        const inputFilePath = req.file.path
        const outputFilePath = path.join(__dirname, 'tmp', `${fileName}.html`)

        const fileBuffer = await parseDocx(inputFilePath, outputFilePath)

        res.json({
            html: fileBuffer.toString('utf8')
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
})

server.post("/api/parse/docx", async function (req, res) {
    try {
        const { fileName } = req.body

        console.log(fileName)

        const parsedFileName = fileName.split('.')[0] 
        const inputFilePath = path.join(__dirname, 'tmp', fileName)
        const outputFilePath = path.join(__dirname, 'tmp', `${parsedFileName}.html`)

        const fileBuffer = await parseDocx(inputFilePath, outputFilePath)

        res.send(fileBuffer)

        await deleteFile(outputFilePath)
    } catch (err) {
        console.error(err)
        res.status(500).send('Internal failure')
    }
})

server.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
server.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
server.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
server.use(express.static("public"))

server.listen(8080, function () {
    console.log("Listening on port 8080")
})