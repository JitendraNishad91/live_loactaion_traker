const cookieParser = require("cookie-parser")
const socketIO = require("socket.io")
const config = require("./config")
const express = require("express")
const tarkine = require("tarkine")
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = new socketIO.Server(server)
const PORT = process.env.PORT || config.port
global.remoteURL = process.env.HOST || `http://localhost:${PORT}`

global.IO = io

app.set("view engine", "html")
app.engine("html", tarkine.renderFile)
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(__dirname + "/public"))
app.use(express.json())

app.use("/", require("./router"))

server.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`LOCAL  : http://localhost:${PORT}`)
    console.log(`REMOTE : ${global.remoteURL}/weather`)

    if (!process.env.HOST) {
        try {
            const { tunnel } = require("cloudflared")
            const url = await tunnel({ "--url": `http://localhost:${PORT}` }).url
            global.remoteURL = url
            console.log(`TUNNEL : ${url}/weather`)
        } catch (e) {
            console.log("Cloudflared not available, using local URL")
        }
    }
})
