import "./scss/styles.scss";
import { icalDownload } from "./js/icsfile";
import bulmaCalendar from "bulma-calendar/dist/js/bulma-calendar.min.js";

// Initialize all input of date type.
const calendars = bulmaCalendar.attach('[type="date"]', {
  showButtons: "true",
  showHeader: "false",
});

// Loop on each calendar initialized
calendars.forEach((calendar) => {
  console.log("hello");
  // Add listener to date:selected event
  calendar.on("date:selected", (date) => {
    console.log("lala");
    console.log(date);
  });
});

function processForm(e) {
  e.preventDefault();
  if (calendars[0].datePicker.date.start === "") {
    let warning = document.getElementById("warning");
    var p = document.createElement("p");
    p.innerHTML = "You have to pick a date";
    p.className = "has-text-danger is-size-7";
    warning.appendChild(p);
    return;
  }
  getSeasons(calendars[0].datePicker.date.start, this.length.value);
}

let form = document.getElementById("form");
if (form.attachEvent) {
  form.attachEvent("submit", processForm);
} else {
  form.addEventListener("submit", processForm);
}

let events;

function getSeasons(date, length = 28) {
  events = [
    {
      date: addDays(date, 0),
      name: "Winter",
      description:
        "Peace and quiet, rest, alone time, solo-time, don’t make demands of me, give me space, I want to feel safe and cozy, I’m not available right now to you, sensitivity, wisdom, creativity, letting go, renewal. Taken from: https://risingwoman.com/4-archetypes-of-the-female-cycle/",
    },
    {
      date: addDays(date, 7),
      name: "Spring",
      description:
        "Rebirth, renewal, fresh-start, productive, focused, independent, learning, strong, able to take on challenges, physically energized, concentration. Taken from: https://risingwoman.com/4-archetypes-of-the-female-cycle/",
    },
    {
      date: addDays(date, 14),
      name: "Summer",
      description:
        "Outward and expressive, flirty, creative, playful, community-focused, relationship building, service, nurturing, love-making, creating, building, holding space for others. Taken from: https://risingwoman.com/4-archetypes-of-the-female-cycle/",
    },
    {
      date: addDays(date, 22),
      name: "Fall",
      description:
        "Lower energy, hormones are dipping, need more space, ask less of me, I don’t want to give right now, moody, less focus and concentration, I want to create, less coordinated, mentally creative, less physically active, heightened creativity, assertive, strategic. Taken from: https://risingwoman.com/4-archetypes-of-the-female-cycle/",
    },
    {
      date: addDays(date, parseInt(length)),
      name: "Start of new cycle",
      description: "Period starts - get you new dates here https://mallle.github.io/seasons/",
    },
  ];

  let resultsText = document.getElementById("resultsText");
  let downloadButton = document.getElementById("downloadButton");

  //Delete all children of resultsText and the downloadButton if l
  resultsText.querySelectorAll("*").forEach((n) => n.remove());
  downloadButton.querySelectorAll("*").forEach((n) => n.remove());

  var headlineResult = document.createElement("h5");
  headlineResult.innerHTML =
    "Here are your estimated dates for the 4 seasons and the start of your next period";
  headlineResult.className = "title is-5";
  resultsText.appendChild(headlineResult);

  //Create texts
  for (let key in events) {
    var p = document.createElement("p");
    var date = events[key].date;
    p.innerHTML =
      events[key].name +
      ": " +
      date.getDate() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getFullYear();
    resultsText.appendChild(p);
  }

  //Crate Download Button and info text to button
  let btn = document.createElement("button");
  downloadButton.appendChild(btn);
  btn.innerHTML = "Download the events to your calendar";
  btn.id = "download";
  btn.className = "button is-primary";

  let infoText = document.createElement("p");
  downloadButton.appendChild(infoText);
  infoText.innerHTML = "Including descriptions for every season";
  infoText.className = "has-text-primary is-size-7";
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

document.addEventListener("click", function (e) {
  if (e.target.id === "download") {
    icalDownload(events);
  }
});
