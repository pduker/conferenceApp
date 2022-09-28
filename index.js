const express = require("express")
const bodyParser = require("body-parser")

const server = express()

server.use(bodyParser.json())
server.get("/", async function(req, res){
    console.log("Jaydon is weird")
    res.send("String")
})

server.listen(8080)
console.log("Done")