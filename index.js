const prompt = require('prompt-sync')({ sigint: true });
const term = require('terminal-kit').terminal;
const showCalendar = require('./calendar.module');
const fs = require('fs').promises;

let localUser;

/**
 * Represents a user.
 */
class User {
    /**
     * Creates a user.
     * @param {string} userid - The user ID.
     * @param {string} username - The user name.
     * @param {number} timestamp - The timestamp.
     */
    constructor(userid, username, timestamp) {
        this.userID = userid;
        this.userName = username;
        this.timeStamp = timestamp;
        this.userEvents = [];
    }

    /**
     * Gets all events of the user.
     * @returns {Array<Object>} The user events.
     */
    getAllEvents() {
        return this.userEvents;
    }

    /**
     * Adds an event to the user.
     * @param {Object} event - The event to add.
     */
    addEvent(event) {
        this.userEvents.push(event);
    }

    /**
     * Modifies an event of the user.
     * @param {number} idElement - The ID of the event to modify.
     * @param {Object} nData - The new data for the event.
     */
    modifyEvent(idElement, nData) {
        const index = this.userEvents.findIndex(el => el.idEvent == idElement);
        if (index !== -1) {
            this.userEvents[index] = nData;
        }
    }

    /**
     * Deletes an event of the user.
     * @param {number} idElement - The ID of the event to delete.
     */
    deleteEvent(idElement) {
        this.userEvents = this.userEvents.filter(el => el.idEvent !== idElement);
    }
}

/**
 * Generates a unique user ID.
 * @returns {string} The generated user ID.
 */
function generateUserId() {
    const timestamp = Date.now().toString(16);
    const randomNum = Math.random().toString(16).substring(2, 10);
    return `user#${timestamp}${randomNum}`;
}

/**
 * Saves data asynchronously to a file.
 * @param {Object} data - The data to save.
 */
async function saveDataAsync(data) {
    try {
        await fs.writeFile('db.json', JSON.stringify(data));
        term('JSON data saved successfully!');
    } catch (err) {
        term('Error writing file', err);
    }
}

/**
 * Reads data asynchronously from a file.
 */
async function readFileAsync() {
    try {
        const data = await fs.readFile('db.json', 'utf-8');
        if (data.trim().length === 0) {
            localUser = {};
        } else {
            const us = JSON.parse(data);
            localUser = new User(us.userID, us.userName, us.timeStamp);
            us.userEvents.forEach(element => localUser.addEvent(element));
        }
    } catch (err) {
        term('Error reading file', err);
    }
}

/**
 * Displays the main menu.
 */
function showMenu() {
    const itemsMenu = [
        ' Añadir➕ ',
        ' Mostrar📜 ',
        ' Modificar✏️ ',
        ' Esborrar❌ ',
        ' sortir🚪 ',
        ' Helpℹ️ '
    ];

    const options = {
        separator: ' | ',
        style: term.bold.inverse,
        selectedStyle: term.dim.blue.bgBrightMagenta
    };

    term.singleLineMenu(itemsMenu, options, (error, response) => {
        if (error) {
            term('ERROR: ', error);
        } else {
            term('\n').eraseLineAfter.white(execFunct(response.selectedIndex));
        }
    });

    term.on('key', key => {
        if (key === 'CTRL_C') {
            term.grabInput(false);
            process.exit();
        }
    });
}

/**
 * Executes the selected menu function.
 * @param {number} res - The selected menu index.
 */
function execFunct(res) {
    switch (res) {
        case 0:
            addNewEvent();
            break;
        case 1:
            showAllEvents();
            break;
        case 2:
            modifyMyEvent();
            break;
        case 3:
            deleteEvent();
            break;
        case 4:
            process.exit();
        case 5:
            showHelp();
            break;
        default:
            showError();
            break;
    }
}

/**
 * Prompts the user to continue.
 */
function question() {
    term('\n');
    const userAnswer = prompt('  Continar? [Si|No]: ');
    term('\n');
    if (userAnswer === '' || userAnswer.toLowerCase() === "si") {
        main();
    } else {
        term.red("  'No' vols continuar?\n");
        question();
    }
}

/**
 * Calculates the difference between two dates.
 * @param {Array<number>} date1 - The first date [day, month, year].
 * @param {Array<number>} date2 - The second date [day, month, year].
 * @param {Array<number>} time1 - The first time [hour, minute].
 * @param {Array<number>} time2 - The second time [hour, minute].
 * @returns {string} The difference in days.
 */
function dateDiff(date1, date2, time1, time2) {
    const ndate1 = new Date(date1[2], date1[1], date1[0], time1[0], time1[1]).getTime();
    const ndate2 = new Date(date2[2], date2[1], date2[0], time2[0], time2[1]).getTime();
    return `${Math.floor((ndate2 - ndate1) / (1000 * 60 * 60 * 24))} dies.`;
}

/**
 * Adds a new event.
 */
function addNewEvent() {
    term.clear();
    const DATEREG = /\d{2}\/\d{2}\/\d{4}/;
    const TIMEREG = /\d{2}:\d{2}/;

    term('\n');
    term.bgBlue('    Crear un nou esdeveniment       \n');
    term('\n');
    const name = prompt('  Nom de l\'esdeveniment: ');
    term('\n');
    const desc = prompt('  Descripció: ');
    term('\n');
    const location = prompt('  Ubicació de l\'esdeveniment: ');
    term('\n');
    term.magenta("!!! Fer servir 'DD/MM/AAAA' per a la data !!!");
    term('\n');
    let datestart;
    do {
        datestart = prompt('  Data d\'inici de l\'esdeveniment: ');
    } while (!DATEREG.test(datestart));
    term('\n');
    term.magenta("!!! Fer servir 'DD/MM/AAAA' per a la data !!!");
    term('\n');
    let dateEnd;
    do {
        dateEnd = prompt('  Data d\'finalització de l\'esdeveniment: ');
    } while (!DATEREG.test(dateEnd));
    term('\n');
    term.magenta("!!! Fer servir 'HH:MM' per a la hora !!!");
    term('\n');
    let timestart;
    do {
        timestart = prompt('Hora d\'inici de l\'esdeveniment: ');
    } while (!TIMEREG.test(timestart));
    term('\n');
    term.magenta("!!! Fer servir 'HH:MM' per a la hora !!!");
    term('\n');
    let timeend;
    do {
        timeend = prompt('Hora de finalització de l\'esdeveniment: ');
    } while (!TIMEREG.test(timeend));

    const monthDifferenceStart = datestart.split("/").map(Number);
    const monthDifferenceEnd = dateEnd.split("/").map(Number);
    const timeDifferenceStart = timestart.split(":").map(Number);
    const timeDifferenceEnd = timeend.split(":").map(Number);

    localUser.addEvent({
        idEvent: Math.floor(Math.random() * 1000),
        nameEvent: name,
        descriptionEvent: desc,
        locationEvent: location,
        startEventDate: datestart,
        endEventDate: dateEnd,
        startEventTime: timestart,
        endEventTime: timeend,
        durationEvent: dateDiff(monthDifferenceStart, monthDifferenceEnd, timeDifferenceStart, timeDifferenceEnd)
    });

    saveDataAsync(localUser);
    question();
}

/**
 * Displays all events.
 */
function showAllEvents() {
    term.clear();
    term('\n');
    term.bold(`  ^BEn aquesta pantalla trobaràs tots els esdeveniments que has creat. \n\n  Pots veure’ls en detall.   📅\n\n`);
    const arr = localUser.getAllEvents();
    arr.forEach(el => {
        term('\n');
        const evnt = [
            ['^yEvento:^ ' + el.nameEvent, `^yEsdeveniment Nº:^  ${el.idEvent}`],
            ['^GDescription:^ ', el.descriptionEvent],
            ['^GLloc:^ ' + el.locationEvent, '^GDuracio:^ ' + el.durationEvent],
            ['^GData comencament:^ ' + el.startEventDate, '^GData tancament:^ ' + el.endEventDate],
            ['^GInici comencament:^ ' + el.startEventTime, '^GInici tancament:^ ' + el.endEventTime],
        ];

        const optionsTable = {
            hasBorder: true,
            contentHasMarkup: true,
            borderChars: 'lightRounded',
            borderAttr: { color: 'blue' },
            textAttr: { bgColor: 'default' },
            firstRowTextAttr: { bgColor: 'blue' },
            last: { bgColor: 'blue' },
            width: 60,
            fit: true,
        };
        term.table(evnt, optionsTable);
    });
    question();
}

/**
 * Modifies an existing event.
 */
function modifyMyEvent() {
    term.clear();
    const arr = localUser.getAllEvents();
    term('\n');
    term.red('  Amb aquesta eina, pots modificar un esdeveniment!\n');
    const arrayOfIdEvents = arr.map(el => el.idEvent);
    arr.forEach(el => {
        term('\n');
        const evnt = [
            ['^yEvento:^ ' + el.nameEvent, '^yEsdeveniment Nº:^ ' + el.idEvent],
        ];
        const optionsTable = {
            hasBorder: true,
            contentHasMarkup: true,
            borderChars: 'lightRounded',
            borderAttr: { color: 'blue' },
            textAttr: { bgColor: 'default' },
            firstRowTextAttr: { bgColor: 'blue' },
            last: { bgColor: 'blue' },
            width: 60,
            fit: true,
        };
        term.table(evnt, optionsTable);
    });
    term('\n');
    term('^G  Si vols sortir, simplement prem la tecla Enter.\n\n');

    const numUser = Number.parseInt(prompt('  Introdueix el número del esdeveniment per modificar: '));

    if (Number.isNaN(numUser) || !arrayOfIdEvents.includes(numUser)) {
        question();
    } else {
        continueModifing(numUser);
    }
}

/**
 * Continues modifying the selected event.
 * @param {number} numUser - The ID of the event to modify.
 */
function continueModifing(numUser) {
    const arr = localUser.getAllEvents();
    const eventToModify = arr.find(el => el.idEvent === numUser);
    const DATEREG = /\d{2}\/\d{2}\/\d{4}/;
    const TIMEREG = /\d{2}:\d{2}/;

    /**
     * Prompts the user with a default value.
     * @param {string} message - The prompt message.
     * @param {string} defaultValue - The default value.
     * @returns {string} The user input or the default value.
     */
    function promptWithDefaultValue(message, defaultValue) {
        const input = prompt(`  ${message}  < ${defaultValue} > : `);
        return input === '' ? defaultValue : input;
    }

    term.clear();
    term('\n');
    term.red('  Modificant el esdeveniment!\n');
    term('\n');
    term.blue('  Escriu el nou valor o prem ENTER per a deixar l\'anterior;\n');
    term('\n');

    const newData = { ...eventToModify };
    const textPrompt = [
        'Nom de l\'esdeveniment: ',
        'Descripció: ',
        'Ubicació de l\'esdeveniment: ',
        'Data d\'inici de l\'esdeveniment: ',
        'Data de finalització de l\'esdeveniment: ',
        'Hora d\'inici de l\'esdeveniment: ',
        'Hora de finalització de l\'esdeveniment: '
    ];

    Object.keys(eventToModify).forEach((key, i) => {
        if (key === "idEvent") {
            term(`^G  Esdeveniment Nº:^ ${eventToModify[key]}`);
        } else if (key === "durationEvent") {
            const monthDifferenceStart = newData.startEventDate.split("/").map(Number);
            const monthDifferenceEnd = newData.endEventDate.split("/").map(Number);
            const timeDifferenceStart = newData.startEventTime.split(":").map(Number);
            const timeDifferenceEnd = newData.endEventTime.split(":").map(Number);
            const duration = dateDiff(monthDifferenceStart, monthDifferenceEnd, timeDifferenceStart, timeDifferenceEnd);
            term(`^G  Duracio de l\'esdeveniment:^ ${duration}`);
            newData[key] = duration;
        } else {
            if (key.includes("Date")) {
                term.magenta("!!! Fer servir 'DD/MM/AAAA' per a la data !!!");
            } else if (key.includes("Time")) {
                term.magenta("!!! Fer servir 'HH:MM' per a la hora !!!");
            }
            term('\n');
            newData[key] = promptWithDefaultValue(textPrompt[i], eventToModify[key]);
        }
    });

    localUser.modifyEvent(numUser, newData);
    saveDataAsync(localUser);
    question();
}

/**
 * Deletes an event.
 */
function deleteEvent() {
    term.clear();
    const arr = localUser.getAllEvents();
    term.red('\n  Estàs segur que vols esborrar aquest element?\n\n');
    term.red('  !!Una vegada es borri no es puc restaurar!!\n');
    arr.forEach(el => {
        term('\n');
        const evnt = [
            ['^yEvento:^ ' + el.nameEvent, '^yEsdeveniment Nº:^ ' + el.idEvent],
        ];
        const optionsTable = {
            hasBorder: true,
            contentHasMarkup: true,
            borderChars: 'lightRounded',
            borderAttr: { color: 'blue' },
            textAttr: { bgColor: 'default' },
            firstRowTextAttr: { bgColor: 'blue' },
            last: { bgColor: 'blue' },
            width: 60,
            fit: true,
        };
        term.table(evnt, optionsTable);
    });
    term('\n');
    term('^G  Si vols sortir, simplement prem la tecla Enter.^\n\n');

    const evntToDelete = prompt('  Introdueix el número del esdeveniment: ');
    if (evntToDelete === "" || evntToDelete === " ") {
        question();
    } else {
        localUser.deleteEvent(Number(evntToDelete));
        saveDataAsync(localUser);
        question();
    }
}

/**
 * Displays the help information.
 */
function showHelp() {
    term.clear();
    term('\n');
    term.bgBlue('░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░');
    term('\n');
    term.bgBlue('░░░░░░░░░░░░█▄█░█░█░░░█▀▀░█▀█░█░░░█▀▀░█▀█░█▀▄░█▀█░█▀▄░░░█▀█░█▀█░█▀█░░░░░░░░░░░░');
    term('\n');
    term.bgBlue('░░░░░░░░░░░░█░█░░█░░░░█░░░█▀█░█░░░█▀▀░█░█░█░█░█▀█░█▀▄░░░█▀█░█▀▀░█▀▀░░░░░░░░░░░░');
    term('\n');
    term.bgBlue('░░░░░░░░░░░░▀░▀░░▀░░░░▀▀▀░▀░▀░▀▀▀░▀▀▀░▀░▀░▀▀░░▀░▀░▀░▀░░░▀░▀░▀░░░▀░░░░░░░░░░░░░░');
    term('\n');
    term.bgBlue('░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░');
    term('\n\n');
    term.bgMagenta("  La app de calendari està dissenyada per gestionar esdeveniments d'una manera \n                           senzilla i intuïtiva.                               ");
    term.bgBlue("\n\n  1. Crear                            🛠️                             (Create):");
    term("\n\n  Els usuaris poden crear nous esdeveniments i afegir detalls com \n  el títol, la data, l'hora, la ubicació i una descripció addicional.");
    term.bgBlue("\n\n  2. Llegir                           📝                               (Read):");
    term("\n\n  Amb la funcionalitat de lectura, els usuaris poden veure els seus esdeveniments.");
    term.bgBlue("\n\n  3. Actualitzar                      🔄                             (Update):");
    term("\n\n  Qualsevol esdeveniment existent pot ser modificat per ajustar informació com \n  la data, l'hora o qualsevol altre detall rellevant.");
    term.bgBlue("\n\n  4. Esborrar                         ♻️                             (Delete):");
    term("\n\n  En cas que un esdeveniment ja no sigui necessari, l’usuari pot \n  eliminar-lo fàcilment. Això ajuda a mantenir el calendari net i organitzat.\n");
    question();
}

/**
 * Displays an error message.
 */
function showError() {
    term('\n\n\n\n\n');
    term('Error a l\'aplicació');
    term('\n\n\n');
    term('Ups! Sembla que alguna cosa ha fallat. No s\'ha pogut processar la teva sol·licitud.');
    term('\n\n\n');
    term('Si us plau, torna-ho a intentar més tard o posa\'t en contacte amb el nostre suport tècnic per obtenir ajuda.');
    term('\n\n\n');
    term('Gràcies per la teva paciència!');
    term('\n\n\n');
    term('\n\n\n');
}

/**
 * The main function.
 */
async function main() {
    await readFileAsync();
    if ("userID" in localUser) {
        term.clear();
        term.bgBlue('░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░');
        term('\n');
        term.bgBlue('░░░░░░░░░░░░█▄█░█░█░░░█▀▀░█▀█░█░░░█▀▀░█▀█░█▀▄░█▀█░█▀▄░░░█▀█░█▀█░█▀█░░░░░░░░░░░░');
        term('\n');
        term.bgBlue('░░░░░░░░░░░░█░█░░█░░░░█░░░█▀█░█░░░█▀▀░█░█░█░█░█▀█░█▀▄░░░█▀█░█▀▀░█▀▀░░░░░░░░░░░░');
        term('\n');
        term.bgBlue('░░░░░░░░░░░░▀░▀░░▀░░░░▀▀▀░▀░▀░▀▀▀░▀▀▀░▀░▀░▀▀░░▀░▀░▀░▀░░░▀░▀░▀░░░▀░░░░░░░░░░░░░░');
        term('\n');
        term.bgBlue('░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░');
        term('\n');
        term('\n');
        term.bgBlue(`  Benvingut 👋 ^Y !${localUser.userName}!                                                        `);
        term.bgBlue(`\n\n  Fem una ullada al teu calendari 🕑 per veure què et porta avui!              `);
        term('\n');
        showMenu();
        term('\n');
        term('\n');
        showCalendar();
    } else {
        term.clear();
        term('\n');
        term.bgBlue('░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░');
        term('\n');
        term.bgBlue('░░░░░░░░░░░░░░░░░░░░█▀▄░█▀▀░█▀█░█░█░▀█▀░█▀█░█▀▀░█░█░▀█▀░█░█░░░░░░░░░░░░░░░░░░░░');
        term('\n');
        term.bgBlue('░░░░░░░░░░░░░░░░░░░░█▀▄░█▀▀░█░█░▀▄▀░░█░░█░█░█░█░█░█░░█░░▀░▀░░░░░░░░░░░░░░░░░░░░');
        term('\n');
        term.bgBlue('░░░░░░░░░░░░░░░░░░░░▀▀░░▀▀▀░▀░▀░░▀░░▀▀▀░▀░▀░▀▀▀░▀▀▀░░▀░░▀░▀░░░░░░░░░░░░░░░░░░░░');
        term('\n');
        term.bgBlue('░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░');
        term('\n\n');
        term.bgBlue("Bon dia! 👋 \n\nBenvingut/da a la teva aplicació de calendari. ");
        term('\n');
        term.bgBlue("\nDissenyada per ajudar-te a organitzar i aprofitar cada moment. \nConsulta els teus esdeveniments, crea recordatoris i planifica la teva setmana \n\nQue avui sigui un dia productiu i ple d’èxits! Comencem?\n");
        term('\n');
        const namePrompt = prompt('Per començar, ens podries dir el teu nom? 📝: ');
        localUser = new User(generateUserId(), namePrompt, new Date().getTime() / 1000);
        saveDataAsync(localUser);
        main();
    }
}

main();