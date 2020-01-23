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
let secretsFound = 0;
let secretsTotal = 5;

$(document).ready(setup);

function setup() {
  setInterval(update, INTERVAL_LENGTH);
  $spans = $('span');
  $spans.on("click", spansClicked);
  secretsTotal = $('.secret').length;
  updateTotalSecrets();
}

function update() {
  $spans.each(updateSpans);
} 

// Updates the span container for total secrets with the number of spans with a secret class
function updateTotalSecrets() {
  $('#totalSecrets').text(secretsTotal);
}

function updateSpans() {
  if(Math.random() <= PROBABILITY_THRESHOLD) {
    $(this).removeClass("redacted");
    $(this).addClass("revealed");
  } 
}

function spansClicked() {
  $(this).removeClass("revealed"); 
  $(this).addClass("redacted");
}