"use strict";

/********************************************************************

Title of Project
Author Name

This is a template. Fill in the title, author, and this description
to match your project! Write JavaScript to do amazing things below!

*********************************************************************/

$(document).ready(setup);
let $mouth;
let $poorFellow;
let buzz;
let chewFX;

function setup() {
  $mouth = $('#mouth');
  $poorFellow = $('#poorFellow');
  $poorFellow.draggable();
  $mouth.droppable({
    drop: onDrop
  });

  buzz = new Audio("assets/sounds/buzz.mp3");
  buzz.loop = true;
  $poorFellow.on("mousedown", playBuzz);
  $poorFellow.on("mouseup", pauseBuzz);

  chewFX = new Audio("assets/sounds/crunch.wav");
}


function onDrop(event, ui) {
  console.log("Dropped");
  ui.draggable.remove();
  setInterval(chew, 1000);
  pauseBuzz();
}

function chew() {
  if($mouth.attr("src") === "assets/images/mouth.jpeg") {
    chewFX.play();
    $mouth.attr("src", "assets/images/open.jpg");
  }
  else {
    $mouth.attr("src", "assets/images/mouth.jpeg");
  }
}

function playBuzz() {
  buzz.play();
}

function pauseBuzz() {
  buzz.pause();
}
