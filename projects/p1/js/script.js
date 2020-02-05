"use strict";

/********************************************************************

Project 1: How long do we spend commuting every day, doing almost nothing?
Sylvain Tran


references:
thrashcan pic: https://twitter.com/pixel_trash_gif
subway background: https://www.creativereview.co.uk/illustrated-story-new-york-subway-map/
subway routine bg: https://www.c42d.com/subway-startup-survey-summer-2018-edition/
animated subway bg: https://imgur.com/t/pixel_art/KkxJYDW
LA subway sound: ciccarelli on freesound.org (https://freesound.org/people/ciccarelli/sounds/112337/)
*********************************************************************/

$(document).ready(setup);
let $calendar;
let currentHour = 8;
let currentMinutes = 0;
const MINS_IN_HOUR = 60;
const MINS_TICK_INCREASE = 10;
const END_OF_SHIFT = 17; // in currentHour
const BEGIN_SHIFT = 8;
const PROBABILITY_THRESHOLD = 0.2; // probability to spawn the poem dialog
let progressBarValue = 0;
const commutingLaborValue = 10;
const maxValueForCommutingJob = 1300;
const minValueForCommutingJob = 0;
let subwayMetroPosX = 0;
let subwayMetroETA = 120;
let subwayMetroETADefault = 120;
const subwaySounds = new Audio("../p1/assets/sounds/subwaySounds.wav");
const strugglingManSound = new Audio("../p1/assets/sounds/strugglingMan.wav");
const subwayMetroPosXValue = 10;
const subwayMetroETAIncrement = 1;
const distanceToDestination = 250;

//setup
//
//Setups the game scene
function setup() {
  $calendar = $('#calendar');
  $calendar.draggable();
  setInterval(updateCalendar, 1 * 1000); // Each 10 seconds is one hour
  setInterval(showPoemDialog, 3000);
  $('#commutingJob').draggable({axis: "x"});
  $("#progressbar").progressbar({
    value: progressBarValue,
    max: maxValueForCommutingJob
  });
  $('#commutingJob').on("drag", function(event, ui){
    console.log(progressBarValue);
    progressBarValue = clampCommutingJobValues(progressBarValue + commutingLaborValue, minValueForCommutingJob, maxValueForCommutingJob);
    updateProgressBar();
    updateCalendar();
    $('#calendar').toggle( "bounce", { times: 1 }, "slow" );
    moveSubway();
    $('#subwayMetro').text("ETA " + Math.floor(subwayMetroETA) + " Lifetimes");
    animateSubway();
    revertColor();
    adjustDesiredDestination();
    strugglingManSound.currentTime = 0;
    strugglingManSound.play();
  });
  $("#thrashcan").droppable({
    tolerance: "intersect",
    drop: removeDiv
  });
  setInterval(revertColor, 1000);
  $(document).one('mousedown', playMusic);
}

function playMusic() {
  subwaySounds.loop = true;
  subwaySounds.play();
}

//sendPoem
//
//Creates a fake reply dialog
function sendPoem() {
  createDialog("Reply from CuriousCat53", "You've got a new message! Don't be late commuting.", "Check new message", "Ignore her", checkPhoneMessage, closeDialog);
}

//checkPhoneMessage(event, ui)
//
//Creates a very realistic phone message div
function checkPhoneMessage(event) {
  // Removes the option
  $(event.target.parentElement).remove();
  let replyMessageBox = document.createElement("div");
  $(replyMessageBox).draggable();
  $(replyMessageBox).addClass("replyMessageBox");
  $(replyMessageBox).append("Message received at: " + currentHour + ":" + currentMinutes + "<br>" + "awww, you're so sweet thanks :-) Where are you, btw? Are you still commuting? :o");
  $('body').append(replyMessageBox);
}

//updateCalendar
//
// Updates the currentHour and currentMinutes of the day
function updateCalendar() {
  if(currentMinutes < MINS_IN_HOUR) {
    currentMinutes += MINS_TICK_INCREASE;
  }
  else {
    currentMinutes = 0;
    if(currentHour < END_OF_SHIFT) {
      currentHour++;
    }
    else {
      currentHour = BEGIN_SHIFT; // restart the day to beginning of shift at 8am
    }
  }
  let finalTime = currentHour + ":" + currentMinutes;
  $calendar.text(finalTime);
}

//showPoemDialog
//
//Shows the poem dialog at random times during the work shift
function showPoemDialog() {
  let randomNumber = Math.random();
  if(randomNumber <= PROBABILITY_THRESHOLD) {
    createDialog("Love Mail", "Send her a poem?", "Yes", "No", sendPoem, closeDialog);
  }
}

//createDialog(title, text, button1, button2, button1Event, button2Event)
//
//creates a generic dialog with the provided args
function createDialog(title, text, button1, button2, button1Event, button2Event) {
  let newDialog = document.createElement("div");

  $(newDialog).addClass(".dialog");
  $(newDialog).attr("title", title);
  $(newDialog).text(text);
  $(newDialog).dialog({
    position: { my: "left top", at: "right bottom"},
    buttons: [
      {
        text: button1,
        click: button1Event
      },
      {
        text: button2,
        click: button2Event
      }
    ]
  });
}

//updateProgressBar
//
// Updates the progress bar on drag event of the Commuting flattener and resets the progress value if > max
function updateProgressBar(){
  console.log("Updating progress bar");
  $('#progressbar').progressbar( "option", "value", progressBarValue);
  if(progressBarValue >= maxValueForCommutingJob) {
    console.log("Exceeding mx progress value");
    resetCommutingJob();
  }
}

//clampCommutingJobValues
//
//clamps a provided Commuting flattening job value arg within the provided min max args
function clampCommutingJobValues(value, min, max){
  if(value > max) {
    return max;
  }
  else if(value < min) {
    return min;
  }
  else {
    return value;
  }
}

//resetCommutingJob
//
//Resets the Commuting job progress bar at the top
function resetCommutingJob() {
  progressBarValue = minValueForCommutingJob;
}

function removeDiv(event, ui) {
  $(ui.draggable).remove();
}

function closeDialog() {
  $(this).dialog("close");
}

function moveSubway() {
  subwayMetroPosX += subwayMetroPosXValue;
  if(subwayMetroPosX > window.innerWidth) {
    subwayMetroPosX = 0;
  }
  else {
    $("#subwayMetro").css("left", subwayMetroPosX);
  }
  subwayMetroETA -= subwayMetroETAIncrement;
  if(subwayMetroETA <= 0) {
    subwayMetroETA = subwayMetroETADefault;
    subwayMetroPosX = 0;
    progressBarValue = 0;
  }
}

function animateSubway() {
  $("#subwayMetro" ).animate({
    color: "black",
    backgroundColor: "rgb( 0, 255, 255 )"
  });
}

function revertColor(){
  $("#subwayMetro" ).animate({
    color: "black",
    backgroundColor: "rgb( 255, 255, 0 )"
  });
}

function adjustDesiredDestination() {
  let currentMetroPos = $("#subwayMetro").css("left");
  let newPosX = parseInt(currentMetroPos) + distanceToDestination + "px";
  $("#desiredDestination").css("left", newPosX);
}