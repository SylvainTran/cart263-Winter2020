"use strict";

/********************************************************************

Project 1: The Butcher Poet
Sylvain Tran


*********************************************************************/

$(document).ready(setup);
let $calendar;
let hours = 8;
let minutes = 0;

//setup
//
//Setups the game scene
function setup() {
  $calendar = $('#calendar');
  $calendar.draggable();
  $('#dialog').dialog({
    buttons: [
      {
        text: "Yes",
        click: sendPoem
      },
      {
        text: "No",
        click: closeDialog
      }
    ]
  });
  setInterval(updateCalendar, 10 * 1000); // Each 10 seconds is one hour
}


function sendPoem() {
  console.log("sending a poem");
}

function closeDialog() {
  console.log("closing dialog");
}


function updateCalendar() {
  if(minutes < 60) {
    minutes += 10;
  }
  else {
    minutes = 0;
    if(hours < 17) {
      hours++;
    }
    else {
      hours = 8; // restart the day to beginning of shift at 8am
    }
  }
  $calendar.text(hours + " : " + minutes);
}
