/*
 * Questo progetto e tutto il suo sorgente sono distribuiti sotto licenza MIT.
 */

const settings     = require("./settings.json")
const parseCourses = require("./parseCourses.js")
const loadGoaData  = require("./goaLoad.js")
const queries      = require("./queries.js")
const moment       = require("moment")
const restify      = require("restify")
const fs           = require("fs")
const prettyjson   = require("prettyjson")
const config       = JSON.parse(fs.readFileSync("./config.json", "utf8"))

// Imposta gli endpoint relativi alla versione 1 delle API REST
function v1Endpoints(server, rooms, lessons, degrees, courses) {
    // Corsi
    server.get('/v1/degrees', (req, res, next) => {
        //res.json(degrees)
		res.header('content-type', config.debug ? 'text' : 'json')
		res.send(config.debug ? prettyjson.render(degrees) : JSON.stringify(degrees))
        next()
    })

    server.get('/v1/degrees/:abbr/courses', (req, res, next) => {
        //res.json(courses.filter(x => x.laurea == req.params.abbr))
		res.header('content-type', config.debug ? 'text' : 'json')
		res.send(config.debug ? prettyjson.render(courses.filter(x => x.laurea == req.params.abbr)) : JSON.stringify(courses.filter(x => x.laurea == req.params.abbr)))
        next()
    })

    server.get('/v1/degrees/:abbr/courses/semesters/:sem', (req, res, next) => {
        //res.json(courses.filter(x => x.laurea == req.params.abbr && x.semestre == req.params.sem))
		res.header('content-type', config.debug ? 'text' : 'json')
		res.send(config.debug ? prettyjson.render(courses.filter(x => x.laurea == req.params.abbr && x.semestre == req.params.sem)) : JSON.stringify(courses.filter(x => x.laurea == req.params.abbr && x.semestre == req.params.sem)))
        next()
    })

    // Edifici
    server.get('/v1/buildings', (req, res, next) => {
        let buildings = new Set()
        for(let i in rooms) {
            buildings.add(rooms[i].building)
        }
        //res.json(Array.from(buildings))
        res.header('content-type', config.debug ? 'text' : 'json')
        config.debug ? res.send(prettyjson.render(Array.from(buildings))) : res.send(JSON.stringify(Array.from(buildings)))
        next()
    })

    server.get('/v1/buildings/:name/rooms', (req, res, next) => {
        //res.json(queries.getRoomsInBuilding(rooms, req.params.name))
		res.header('content-type', config.debug ? 'text' : 'json')
		res.send(config.debug ? prettyjson.render(queries.getRoomsInBuilding(rooms, req.params.name)) : JSON.stringify(queries.getRoomsInBuilding(rooms, req.params.name)))
        next()
    })

    // Lezioni
    server.get('/v1/lessons/days/:day', (req, res, next) => {
        //res.json(lessons.filter(x => x.lessons == req.params.day))
		res.header('content-type', config.debug ? 'text' : 'json')
		res.send(config.debug ? prettyjson.render(lessons.filter(x => x.lessons == req.params.day)) : JSON.stringify(lessons.filter(x => x.lessons == req.params.day)))
        next()
    })

    server.get('/v1/lessons/days/:day/:hour/:minute', (req, res, next) => {
        const moment = moment(parseInt(req.params.hour).toString() + ":" + parseInt(req.params.minute).toString())
        //res.json(queries.getLessonsDuringMoment(lessons, req.params.day, moment))
		res.header('content-type', config.debug ? 'text' : 'json')
		res.send(config.debug ? prettyjson.render(queries.getLessonsDuringMoment(lessons, req.params.day, moment)) : JSON.stringify(queries.getLessonsDuringMoment(lessons, req.params.day, moment)))
        next()
    })

    server.get('/v1/lessons/buildings/:bld', (req, res, next) => {
        const isInBuilding = (roomname, building) => {
            const room = rooms.find(x => x.name == roomname)
            return room && room.building == building
        }
        //res.json(lessons.filter(x => isInBuilding(x.room, req.params.bld)))
		res.header('content-type', config.debug ? 'text' : 'json')
		res.send(config.debug ? prettyjson.render(lessons.filter(x => isInBuilding(x.room, req.params.bld))) : JSON.stringify(lessons.filter(x => isInBuilding(x.room, req.params.bld))))
        next()
    })

    server.get('/v1/lessons/rooms/:room', (req, res, next) => {
        //res.json(lessons.filter(x => x.room == req.params.room))
		res.header('content-type', config.debug ? 'text' : 'json')
		res.send(config.debug ? prettyjson.render(lessons.filter(x => x.room == req.params.room)) : JSON.stringify(lessons.filter(x => x.room == req.params.room)))
        next()
    })
}

async function main() {
    console.log("Server REST in avvio. Caricamento dati in corso...");
    const { rooms, lessons } = await loadGoaData()
    const { degrees, courses } = await parseCourses()
    console.log("Caricamento completato. Avvio server REST...")
    const server = restify.createServer()
    v1Endpoints(server, rooms, lessons, degrees, courses)
    server.name = "unipi-info-bot"
    server.listen(config.port, () => {
        console.log('Server in ascolto:', server.name, server.url)
    })
}

main()
