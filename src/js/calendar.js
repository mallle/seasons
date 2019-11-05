
const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

const dayNames = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

export function initKalendar(month, year, tableId) {

    // actuall day for highlighting in the Calendar
    let today = new Date();
    let thisMonth = today.getMonth() + 1;
    let thisYear = today.getFullYear();
    let thisDay = today.getDate();

    // detect Weekday of the first day in a Month and keep information in 'start'
    let time = new Date(year, month - 1);
    let monthStart = time.getDay();

    if (monthStart > 0) {
        monthStart--;
    } else {
        monthStart = 6;
    }

    //most month has 31 days...
    let monthEnd = 31;

    // ...April (4), Juni (6), September (9) und November (11) has only 30 days...
    if (month == 4 || month == 6 || month == 9 || month == 11) {
        --monthEnd
    };

    // ...Febuary has only 28 Tage...
    if (month == 2) {
        monthEnd = monthEnd - 3;
        // ...außer in Schaltjahren
        if (Jahr % 4 == 0) monthEnd++;
        if (Jahr % 100 == 0) monthEnd--;
        if (Jahr % 400 == 0) monthEnd++;
    }

    // Get table for Calendar
    let table = document.getElementById(tableId);
    // Write Tablehead
    let caption = table.createCaption();
    caption.textContent = `${monthNames[month - 1]} ${year}`;

    // schreibe Tabellenkopf
    let row = table.insertRow(0);
    for (var i = 0; i <= 6; i++) {
        let cell = row.insertCell(i);
        cell.innerHTML = dayNames[i];
    }
    let dayNumber = 1;

    for (var i = 0; i <= 4; i++) {
        let row = table.insertRow(1 + i);

        for (let j = 0; j <= 6; j++) {

            // Zellen vor dem Start-Tag in der ersten Zeile und Zeilen nach dem Stop-Tag werden leer aufgefüllt
            if (((i == 0) && (j <= 5) && (j < monthStart)) || (dayNumber > monthEnd)) {
                let cell = row.insertCell(j);
                cell.innerHTML = ' ';
            } else {
                // normale Zellen werden mit der Tageszahl befüllt und mit der Klasse Kalendertag markiert
                let cell = row.insertCell(j);
                cell.innerHTML = dayNumber;
                cell.className = 'kalendertag'

                // und der aktuelle Tag (heute) wird noch einmal speziell mit der Klasse "heute" markiert
                if ((year == thisYear) && (month == thisMonth) && (dayNumber == thisDay)) {
                    cell.className = cell.className + ' heute';
                }
                dayNumber++;
            }
        }
    }
}