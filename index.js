const path = require('path')
const express = require("express")
const bodyParser = require("body-parser")
const fs = require("fs")
const multer = require("multer")

const uploadMiddleware = multer({ storage: multer.diskStorage({ destination: "./tmp"}) })

const { parseDocx, deleteFile, exportYAML } = require("./src/parser.js")

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

        const authors = {}
        for (const [rawkey, value] of Object.entries(req.body)) {
            const splitVals = rawkey.split("-")
            const id = splitVals[1]
            const field = splitVals[0]

            let temp = authors[id]

            // If we have not added an entry yet for that author, add it
            if (!temp) {
                temp = {}
            }

            temp[field] = value

            // Update our authors listing based off the id
            authors[id] = temp
        }

        const fileName = req.file.filename

        const inputFilePath = req.file.path
        const outputFilePath = path.join(__dirname, 'tmp', `${fileName}.html`)

        const fileBuffer = await parseDocx(inputFilePath, outputFilePath)
        const abstractHTML = fileBuffer.toString('utf8')

        await exportYAML(authors, abstractHTML)

        res.json({
            html: abstractHTML
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