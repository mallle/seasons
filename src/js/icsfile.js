export function icalDownload(events) {
    let isc = new ICS(events);
    isc.generateFile();
}

class ICS {

    constructor(events) {
        this.events = events
    }

    set events(events) {
        this._events = events;
    }

    get events() {
        return this._events;
    }

    //iso date for ical formats
    isofix(d) {
        let offset = ("0" + ((new Date()).getTimezoneOffset() / 60)).slice(-2);

        if (typeof d == 'string') {
            // return d.replace(/\-/g, '') + 'T' + offset + '0000Z';
            return d.replace(/\-/g, '');
        } else {
            // return d.getFullYear() + this.zp(d.getMonth() + 1) + this.zp(d.getDate()) + 'T' + this.zp(d.getHours()) + "0000Z";
            return d.getFullYear() + this.zp(d.getMonth() + 1) + this.zp(d.getDate());
        }
    }

    //zero padding for data fixes
    zp(s) {
        return ("0" + s).slice(-2);
    }

    save(fileURL) {
        if (!window.ActiveXObject) {
            let save = document.createElement('a');
            save.href = fileURL;
            save.target = '_blank';
            save.download = 'Seasons';

            let evt = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': false
            });
            save.dispatchEvent(evt);

            (window.URL || window.webkitURL).revokeObjectURL(save.href);
        }

        // for IE < 11
        else if (!!window.ActiveXObject && document.execCommand) {
            let _window = window.open(fileURL, '_blank');
            _window.document.close();
            _window.document.execCommand('SaveAs', true, 'seasons')
            _window.close();
        }
    }

    generateFile() {

        let ics_lines = ["BEGIN:VCALENDAR"];

        for (let key in this.events) {

            var now = new Date();
            ics_lines.push(
                "VERSION:2.0",
                "PRODID:-//Addroid Inc.//iCalAdUnit//EN",
                "CALSCALE:GREGORIAN",
                "METHOD:PUBLISH",
                "BEGIN:VEVENT",
                "UID:event-" + key + now.getTime() + "@seasons.com",
                "DTSTAMP:" + this.isofix(now),
                "DTSTART;VALUE=DATE:" + this.isofix(this.events[key].date),
                // "DTEND:" + this.isofix(this.startDate),
                "DESCRIPTION:" + this.events[key].description,
                "SUMMARY:" + this.events[key].name,
                "LAST-MODIFIED:" + this.isofix(now),
                "STATUS:CONFIRMED",
                "SEQUENCE:0",
                "END:VEVENT",
            );
        }
        ics_lines.push("END:VCALENDAR");

        // let dlurl = 'data:text/calendar;base64,' + btoa(ics_lines.join('\r\n'));
        let dlurl = 'data:text/calendar;base64,' + this.base64EncodeUnicode(ics_lines.join('\r\n'));

        try {
            this.save(dlurl);
        } catch (e) {
            console.log(e);
        }
    }

    base64EncodeUnicode(str) {
        // First we escape the string using encodeURIComponent to get the UTF-8 encoding of the characters, 
        // then we convert the percent encodings into raw bytes, and finally feed it to btoa() function.
        let utf8Bytes = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
            return String.fromCharCode('0x' + p1);
        });

        return btoa(utf8Bytes);
    }
}