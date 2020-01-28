"use strict";

/********************************************************************

Project 1
Sylvain Tran


*********************************************************************/

$(document).ready(setup);


//setup
//
//Setups the game scene
function setup() {
  $('#dialog').dialog({
    buttons: [
      {
        text: "Yes",
        click: sendPoem
      },
      {
        text: "No"
      }
    ]
  });
}


function sendPoem() {
  console.log("sending a poem");
}
