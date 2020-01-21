"use strict";

/********************************************************************

Title of Project
Author Name

This is a template. Fill in the title, author, and this description
to match your project! Write JavaScript to do amazing things below!

*********************************************************************/
let $spans;
const INTERVAL_LENGTH = 500;
const PROBABILITY_THRESHOLD = 0.1;

$(document).ready(setup);

function setup() {
  setInterval(update, INTERVAL_LENGTH);
  $spans = $('span');
  $spans.on("click", spansClicked);
}

function update() {
  console.log("Updating");
  $spans.each(updateSpans);
} 

function updateSpans() {
  console.log("Updating each $spans");
  if(Math.random() <= PROBABILITY_THRESHOLD) {
    $(this).removeClass("redacted");
    $(this).addClass("revealed");
  } 
}

function spansClicked() {
  console.log("Clicked a span");
  $(this).removeClass("revealed"); 
  $(this).addClass("redacted");
}