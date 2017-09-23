/*
 * Questo progetto e tutto il suo sorgente sono distribuiti sotto licenza MIT.
 */

const settings = require("./settings.json")
const parseCourses = require("./parseCourses.js")
const loadGoaData = require("./goaLoad.js")
const queries = require("./queries.js")
const moment = require("moment")

async function main() {
    const { rooms, lessons } = await loadGoaData()
    const { degrees, courses } = await parseCourses()
    console.log("Lauree:")
    degrees.map(x => console.log(x.sigla, x.nome))
    console.log("Corsi:")
    courses.map(x => console.log(x.sigla, x.titolo))
    console.log("Aule libere venerdì alle 11.20:")
    queries.getFreeRooms(lessons, rooms, "Ven", moment("11:20", "HH:mm")).map(x => console.log(x.name))
    console.log("Aule libere venerdì alle 11.20 al Fibonacci:")
    queries.getFreeRooms(lessons,
        queries.getRoomsInBuilding(rooms, "Polo Fibonacci B"),
        "Ven", moment("11:20", "HH:mm"))
        .map(x => console.log(x.name))
}

main()