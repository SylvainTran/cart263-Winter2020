"use strict";

/********************************************************************

Project 1: Commuting The Unrequited Love 
How long do we spend commuting every day, doing almost nothing?
And how is this connected to unrequited love?

Sylvain Tran


references:
thrashcan pic: https://twitter.com/pixel_trash_gif
subway background: https://www.creativereview.co.uk/illustrated-story-new-york-subway-map/
subway routine bg: https://www.c42d.com/subway-startup-survey-summer-2018-edition/
animated subway bg: https://imgur.com/t/pixel_art/KkxJYDW
LA subway sound: ciccarelli on freesound.org (https://freesound.org/people/ciccarelli/sounds/112337/)
*********************************************************************/

$(document).ready(setup);
// The clock at the top and its settings
let $clock;
let currentHour = 8;
let currentMinutes = 0;
const MINS_IN_HOUR = 60;
const HOUR_OFFSET = 10;
const MINS_TICK_INCREASE = 10;
const END_OF_SHIFT = 17; // in currentHour
const BEGIN_SHIFT = 8;
// The useless progress bar in the centre 
let progressBarValue = 0;
// The commuting job handler settings
const commutingLaborValue = 10;
const maxValueForCommutingJob = 1300;
const minValueForCommutingJob = 0;
// The message dialog settings
const MESSAGE_PROBABILITY_THRESHOLD = 0.2; // probability to spawn the text dialog
const intervalToCallNewDialog = 1000;
// The metro car moving across the screen by the commuting job handler
let subwayMetroPosX = 0;
let subwayMetroETA = 120;
let subwayMetroETADefault = 120;
const subwayMetroPosXValue = 10;
const subwayMetroETAIncrement = 1;
const distanceToDestination = 350;
// Sound effects
const subwaySounds = new Audio("../p1/assets/sounds/subwaySounds.wav");
const strugglingManSound = new Audio("../p1/assets/sounds/strugglingMan.wav");
// Colors
const cyanColor = "rgb( 255, 255, 0 )";
const yellow = "rgb( 0, 255, 255 )";

//setup
//
//Setups the game scene
function setup() {
  // clock related setting up
  $clock = $('#clock');
  $clock.draggable();
  setInterval(updateClock, 1 * intervalToCallNewDialog); 
  // Dialog spawner
  setInterval(handleMessageDialog, intervalToCallNewDialog);
  // Useless progress bar
  $("#progressbar").progressbar({
    value: progressBarValue,
    max: maxValueForCommutingJob
  });
  // Commuting job handler 
  $('#commutingJob').draggable({axis: "x", containment: "parent"});
  $('#commutingJob').on("drag", function(event, ui){
    progressBarValue = clampCommutingJobValues(progressBarValue + commutingLaborValue, minValueForCommutingJob, maxValueForCommutingJob);
    updateProgressBar();
    // clock related updates
    updateClock();
    $('#clock').toggle( "bounce", { times: 1 }, "slow" );
    // Subway related updates
    moveSubway();
    $('#subwayMetro').text("ETA " + Math.floor(subwayMetroETA) + " Lifetimes");
    animateSubway(cyanColor);
    animateSubway(yellow);
    adjustDesiredDestination();
    // Sound effects
    strugglingManSound.currentTime = 0;
    strugglingManSound.play();
    $(document).one('mousedown', playMusic);
  });
  // Thrash can drop event
  $("#thrashcan").droppable({
    tolerance: "intersect",
    drop: removeDiv
  });
}

//playMusic
//
//Sets music in arg to looping or not, and plays it
function playMusic() {
  subwaySounds.loop = true;
  subwaySounds.play();
}

//sendPoem
//
//Creates a fake reply dialog
function sendPoem() {
  createDialog("Reply from CuriousCat53", "You've got a new message! Don't be distracted while commuting.", "Check new message", "Ignore notification", checkPhoneMessage, closeDialog);
}

//checkPhoneMessage(event)
//
//Creates a very realistic phone message div
function checkPhoneMessage(event) {
  // Removes the option to annoy the user
  $(event.target.parentElement).remove();
  let replyMessageBox = document.createElement("div");
  $(replyMessageBox).draggable();
  $(replyMessageBox).addClass("replyMessageBox");
  $(replyMessageBox).append("Message received at: " + currentHour + ":" + currentMinutes + "." + "<br>" + "CuriousCat53 has deleted your message.");
  $('body').append(replyMessageBox);
}

//updateClock
//
// Updates the currentHour and currentMinutes of the day
function updateClock() {
  if(currentMinutes < MINS_IN_HOUR - HOUR_OFFSET) {
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
  $clock.text(finalTime);
}

//handleMessageDialog
//
//Shows the poem dialog at random times during the work shift
function handleMessageDialog() {
  let randomNumber = Math.random();
  if(randomNumber <= MESSAGE_PROBABILITY_THRESHOLD) {
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
  $('#progressbar').progressbar( "option", "value", progressBarValue);
  if(progressBarValue >= maxValueForCommutingJob) {
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

//removeDiv
//
//Removes the dragged ui
function removeDiv(event, ui) {
  $(ui.draggable).remove();
}

//closeDialog
//
//Closes this dialog
function closeDialog() {
  $(this).dialog("close");
}

//moveSubway
//
//Moves the div subway uselessly across the screen when the user drags the commuting handler
function moveSubway() {
  subwayMetroPosX += subwayMetroPosXValue;
  // Resets position when exceeding the size of the inner window
  if(subwayMetroPosX > window.innerWidth) {
    subwayMetroPosX = 0;
  }
  else {
    $("#subwayMetro").css("left", subwayMetroPosX);
  }
  subwayMetroETA -= subwayMetroETAIncrement;
  //Resets the ETA when hitting 0 (or below)
  if(subwayMetroETA <= 0) {
    subwayMetroETA = subwayMetroETADefault;
    subwayMetroPosX = 0;
    progressBarValue = 0;
  }
}

//animateSubway
//
//Animates the subway's color to the value provided in arg
function animateSubway(rgbValues) {
  $("#subwayMetro" ).animate({
    color: "black",
    backgroundColor: rgbValues
  });
}

//adjustDesiredDestination
//
//Adjusts the metro car's distance from the desired destination
function adjustDesiredDestination() {
  let currentMetroPos = $("#subwayMetro").css("left");
  let newPosX = parseInt(currentMetroPos) + distanceToDestination + "px";
  $("#desiredDestination").css("left", newPosX);
}