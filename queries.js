/**
 * Restituisce tutte le aule in un edificio
 * @param {Room[]} rooms
 * @param {String} building
 * @returns {Room[]}
 */
const getRoomsInBuilding =
    (rooms, building) => rooms.filter(x => x.building == building)

/**
 * Restituisce tutte le lezioni che si stanno svolgendo
 * in un dato momento
 * @param {Lesson[]} lessons
 * @param {String} day
 * @param {moment} m
 * @returns {Lesson[]}
 */
const getLessonsDuringMoment =
    (lessons, day, m) => lessons.filter(x => x.day == day && m.isBetween(x.beginning, x.end))

/**
 * Ottiene tutte le aule libere ad una certa ora in un dato edificio
 * @param {Lesson[]} lessons
 * @param {Room[]} rooms
 * @param {String} day
 * @param {moment} hour
 * @returns {Lesson[]}
 */
function getFreeRooms(lessons, rooms, day, hour) {
    const lessonsDuringHour = getLessonsDuringMoment(lessons, day, hour)
    return rooms.filter(x => !lessonsDuringHour.find(y => y.room == x.name))
}

/**
 * Ottiene tutte le lezioni tenute da un dato corso
 * @param {Lesson[]} lessons
 * @param {Course} course
 * @returns {Lesson[]}
 */
const getCourseLessons =
    (lessons, course) => lessons.filter(x => x.ownername == course.sigla)

module.exports = {
    getRoomsInBuilding: getRoomsInBuilding,
    getLessonsDuringMoment: getLessonsDuringMoment,
    getFreeRooms: getFreeRooms
}
