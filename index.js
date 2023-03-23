const path = require('path')
const express = require("express")
const bodyParser = require("body-parser")
const fs = require("fs")
const multer = require("multer")
const yaml = require('js-yaml')

const uploadMiddleware = multer({ storage: multer.diskStorage({ destination: "./tmp"}) })
const authMiddleware = require('./src/auth/middleware')

const { parseDocx, deleteFile, exportYAML } = require("./src/parser.js")
const { buildAuthorsMap, initializeServer, parseSuppMats } = require("./src/utils")
const { createPaper, getAllPapers, getPaperByTitle, getAllPapersBySession, updatePaper } = require("./src/database/papers")
const authRoutes = require('./src/routes/auth')
const sessionRoutes = require('./src/routes/sessions')
const dayRoutes = require('./src/routes/days')
const pdfRoutes = require('./src/routes/pdf')

const server = express()

server.use(bodyParser.json())

server.get("/", async function(req, res) {
    const html = fs.readFileSync("./public/index.html")
    res.send(html.toString())
})

// This loads in the routes from the router in authRoutes, as if they were defined directly here at /api/auth
server.use("/api/auth", authRoutes)

server.use('/api/sessions', sessionRoutes)

server.use('/api/days', dayRoutes)

server.use('/api/pdfs', pdfRoutes)

server.get('/api/papers', async function (req, res) {
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

server.put("/api/papers", async function (req, res) {
    try {
        const newPaper = req.body

        await updatePaper(newPaper)

        res.sendStatus(200)
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
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

        await createPaper(title, authors, abstractHTML, suppMats)

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


server.get('/login', async function (req, res) {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'public', 'login.html'))
        res.send(data.toString())
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

server.get('/scheduler', async function (req, res) {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'public', 'scheduler.html'))
        res.send(data.toString())
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

server.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
server.use('/css', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/css')))
server.use('/js', express.static(path.join(__dirname, 'node_modules/@forttawesome/fontawesome-free/js')))
server.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
server.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
server.use('/js', express.static(path.join(__dirname, 'node_modules/texlive')))
server.use(express.static("public"))

// Protected authenticated routing from here on

server.use(authMiddleware)

// Test function to see if the middleware is running
server.get('/api/valid', async function (req, res) {
    res.send('Valid!')
})

server.listen(8080, () => {
    initializeServer(__dirname)
    console.log("Listening on port 8080")
})