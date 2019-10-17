import document from "document";
import clock from "clock";

clock.granularity = "seconds";

var runningEntry = null;
var durationLabel = null;
var lastTo = 0;

const secondsContainer = document.getElementById("arc-seconds");
const secondsContainerBack = document.getElementById("arc-seconds-back");
const secondsAnim = secondsContainer.getElementById("anim");
const secondsArc = secondsContainer.getElementById("arc");

export function UI() {
  this.status = document.getElementById("status");
  this.circle = document.getElementById("circle");
  this.entryLabel = document.getElementById("entry");
  durationLabel = document.getElementById("duration");
  this.timer = null;
  this.entry = null;
}

UI.prototype.updateUI = function(data) {
  console.log("updateUI");
  if (data.type === "current-entry") {
    this.updateTimer(data.data);
  } else if (data.type === "entry-stop") {
    this.updateTimer(null);
  }
}

UI.prototype.updateTimer = function(data) {
  console.log("Update timer");

  runningEntry = data;
  this.entry = data;
  this.status.text = (!!data) ? "◻": ">";
  if (!!data) {
    //Running entry
    console.log("Description - " + data.description);
    this.entryLabel.text = (!!data.description)? data.description: "(no description)";
    this.circle.style.fill = "#db1e1e";
    toggleArc(true);
  } else {
    durationLabel.text = "";
    this.entryLabel.text = "";
    this.circle.style.fill = "#228B22";
    toggleArc(false);
  }
}

var toggleArc = function(show) {
  if (show) {
    secondsContainer.style.display = "inline";
    secondsContainerBack.style.display = "inline";
  } else {
    secondsContainer.style.display = "none";
    secondsContainerBack.style.display = "none";
  }
}

var updateDuration = function() {
  //console.log("Calc duration");
  let duration = new Date() - new Date(runningEntry.start);
  let seconds = parseInt((duration / 1000) % 60, 10);
  let minutes = parseInt((duration / (1000 * 60)) % 60, 10);
  let hours = parseInt(duration / (1000 * 60 * 60), 10);

  // circle animation
  secondsAnim.to = calcArc(seconds, 60);
  secondsAnim.from = lastTo;

  lastTo = secondsAnim.to;
  //console.log(secondsAnim.from + " -> " + secondsAnim.to + " = " + seconds);
  secondsContainer.animate("enable");

  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  durationLabel.text = hours + ':' + minutes + ':' + seconds;
}

function calcArc(current, steps) {
  let angle = (360 / steps) * current;
  console.log ("Angle: " + angle);
  return angle > 360 ? 360 : angle;
}

clock.ontick = e => {
  if (!!runningEntry) {
    updateDuration();
  }
}
