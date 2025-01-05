const term = require('terminal-kit').terminal;

/**
 * Displays the calendar for the current month.
 */
function showCalendar() {
    const monthNames = [
        "gener", "febrer", "març", "abril", "maig", "juny",
        "juliol", "agost", "setembre", "octubre", "novembre", "desembre"
    ];

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentDayOfMonth = today.getDate();

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const lastDayOfPreviousMonth = new Date(currentYear, currentMonth, 0).getDate();

    const calendarHeader = [
        [" ^kDiumenge", "  ^kDilluns", " ^kDimarts", " ^kDimecres", "  ^kDijous", " ^kDivendres", " ^kDissabte"]
    ];

    const calendarDays = generateCalendarDays(firstDayOfMonth, lastDayOfMonth, lastDayOfPreviousMonth, currentDayOfMonth);

    const optionsTable = {
        hasBorder: true,
        contentHasMarkup: true,
        borderChars: 'lightRounded',
        borderAttr: { color: 'blue' },
        textAttr: { bgColor: 'white' },
        firstRowTextAttr: { bgColor: 'blue' },
        last: { bgColor: 'blue' },
        lineWrap: true,
        width: 80,
        fit: true,
    };

    term.bgMagenta(`                          <<<    ${monthNames[currentMonth].toUpperCase()} ${currentYear}    >>>                             `);
    term("\n");
    term.table(calendarHeader.concat(calendarDays), optionsTable);
}

/**
 * Generates the days for the calendar.
 * @param {number} firstDayOfMonth - The first day of the month.
 * @param {number} lastDayOfMonth - The last day of the month.
 * @param {number} lastDayOfPreviousMonth - The last day of the previous month.
 * @param {number} currentDayOfMonth - The current day of the month.
 * @returns {Array<Array<string>>} The calendar days.
 */
function generateCalendarDays(firstDayOfMonth, lastDayOfMonth, lastDayOfPreviousMonth, currentDayOfMonth) {
    const days = [];
    let dayCounter = 1;
    let nextMonthDayCounter = 1;

    for (let week = 0; week < 6; week++) {
        const row = [];
        for (let day = 0; day < 7; day++) {
            if (week === 0 && day < firstDayOfMonth) {
                row.push(`^[magenta]    ${lastDayOfPreviousMonth - (firstDayOfMonth - day - 1)}`);
            } else if (dayCounter === currentDayOfMonth) {
                row.push(`  ^[bg:magenta]  ${dayCounter++}  `);
            } else if (dayCounter > lastDayOfMonth) {
                row.push(`^[magenta]    ${nextMonthDayCounter++}`);
            } else {
                row.push(`^[blue]    ${dayCounter++}`);
            }
        }
        days.push(row);
    }

    return days;
}

module.exports = showCalendar;