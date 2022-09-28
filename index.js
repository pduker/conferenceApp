const path = require('path')
const express = require("express")
const bodyParser = require("body-parser")
const fs = require("fs")

const { parseDocx } = require("./src/parser.js")

const server = express()

server.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
server.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
server.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

server.use(bodyParser.json())
server.get("/", async function(req, res) {
    const html = fs.readFileSync("./public/index.html")
    res.send(html.toString())
})

server.post("/api/parse/docx", async function (req, res) {
    const { fileName } = req.body

    console.log(fileName)

    const text = await parseDoc('./test.docx')

    console.log(text)

    res.send(text)
})

server.use(express.static("public"))

server.listen(8080, function () {
    console.log("Listening on port 8080")
})