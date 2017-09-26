/*
 * Questo progetto e tutto il suo sorgente sono distribuiti sotto licenza MIT.
 *
 * Descrizione: utilities per elaborare i dati GOA
 */

const request       = require("request")
const { promisify } = require("util")
const moment        = require("moment")
const settings      = require("./settings.json")

const requestAsync = promisify(request)

async function loadLessons() {
    const timetable = JSON.parse((await requestAsync(settings.urlGoa.timetable)).body)
    return timetable.days
        .map(day =>
            day.rooms.map(room =>
                room.lessons.map(lesson =>
                    {
                        lesson.room = room.name
                        lesson.day = day.name
                        lesson.beginning = moment(lesson.time, "HH:mm")
                        lesson.end = lesson.beginning.clone().add(moment.duration(lesson.duration, "minutes"))
                        return lesson
                    }
                )).reduce((a, b) => a.concat(b)))
        .reduce((a, b) => a.concat(b))
}

async function loadRoomlist() {
    const roomlist = JSON.parse((await requestAsync(settings.urlGoa.roomlist)).body)
    const data = []

    for(const key in roomlist) {
        data.push(roomlist[key])
    }

    return data
}

async function loadData() {
    const lessonsPromise = loadLessons()
    const roomlistPromise = loadRoomlist()

    let [roomlist, lessons] = await Promise.all([roomlistPromise, lessonsPromise])

    let data = {
        rooms: roomlist,
        lessons: lessons
    }

    return data
}

module.exports = loadData
