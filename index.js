const path = require('path')
const express = require("express")
const bodyParser = require("body-parser")
const fs = require("fs")
const multer = require("multer")
const yaml = require('js-yaml')

const authMiddleware = require('./src/auth/middleware')

const { initializeServer } = require("./src/utils")
const authRoutes = require('./src/routes/auth')
const sessionRoutes = require('./src/routes/sessions')
const dayRoutes = require('./src/routes/days')
const paperRoutes = require('./src/routes/papers')

const server = express()

server.use(bodyParser.json())

server.get("/", async function(req, res) {
    const html = fs.readFileSync("./public/index.html")
    res.send(html.toString())
})

// This loads in the routes from the router in authRoutes, as if they were defined directly here at /api/auth
server.use("/api/auth", authRoutes)

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
server.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
server.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
server.use(express.static("public"))

// Protected authenticated routing from here on

server.use(authMiddleware)

// Test function to see if the middleware is running
server.get('/api/valid', async function (req, res) {
    res.send('Valid!')
})

server.use('/api/sessions', sessionRoutes)

server.use('/api/days', dayRoutes)

server.use('/api/papers', paperRoutes)

server.listen(8080, () => {
    initializeServer(__dirname)
    console.log("Listening on port 8080")
})