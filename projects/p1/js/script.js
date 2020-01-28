"use strict";

/********************************************************************

Project 1: The Butcher Poet
Sylvain Tran


*********************************************************************/

$(document).ready(setup);
let $calendar;

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
}


function sendPoem() {
  console.log("sending a poem");
}

function closeDialog() {
  console.log("closing dialog");
}


function updateCalendar() {

}
