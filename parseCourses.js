/*
 * Questo progetto e tutto il suo sorgente sono distribuiti sotto licenza MIT.
 *
 * Descrizione: utilities per effettuare il parsing della pagina d'elenco dei corsi.
 */

const settings  = require("./settings.json")
const jsdom     = require("jsdom")
const { JSDOM } = jsdom

async function parseCourses() {
    const dom = await JSDOM.fromURL(settings.urlCorsi, {
        // Assicuriamoci di non essere rimbalzati dal server
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36"
    });
    const document = dom.window.document

    const coursesTable = document.getElementById('table2')
    const courseNameRegex = /\s*([^-]+)(?:\s+-\s+.+)?/
    // La prima riga va scartata perchè contiene l'intestazione
    const courses = Array.from(coursesTable.rows).slice(1).map(row => ({
        codice: row.cells[0].textContent.trim(),
        sigla: row.cells[1].textContent.trim(),
        crediti: row.cells[2].textContent.trim(),
        semestre: row.cells[3].textContent.trim(),
        laurea: row.cells[4].textContent.trim(),
        titolo: row.cells[5].textContent.match(courseNameRegex)[1].trim(),
        urls: Array.from(row.getElementsByTagName('a')).map(link =>
            link.textContent.length > 3 ? link.href : { nome: link.textContent.trim(), url: link.href })
    }))

    const legendList = document.querySelector("#log > ul")
    const regex = /\s*(\w+-\w+)\s*:\s*([\w\s]+)\s*/
    const degrees = Array.from(legendList.children)
        .filter(item => item.textContent) // Non tutte le righe sono popolate
        .map(item => item.textContent.match(regex))
        .map(split => ({
            // split[0] contiene l'intera stringa riconosciuta dalla regex
            sigla: split[1].trim(),
            nome: split[2].trim()
        }))

    return {
        courses: courses,
        degrees: degrees
    }
}

module.exports = parseCourses
