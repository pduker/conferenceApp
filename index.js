const express = require("express")
const bodyParser = require("body-parser")
const fs = require("fs")

const server = express()

server.use(bodyParser.json())
server.get("/", async function(req, res){
    console.log("Jaydon is weird")
    const html = fs.readFileSync("./public/index.html")
    res.send(html.toString())
})

server.use(express.static("public"))

server.listen(8080)
console.log("Done")