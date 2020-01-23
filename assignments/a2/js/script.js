"use strict";

/********************************************************************

Assignment 2 - Raving Redactionist Redux
Sylvain Tran

My Raving Redactionist Redux
...
...
Art is never finished, only abandoned

*********************************************************************/
let $spans;
let $secrets;
const INTERVAL_LENGTH = 500;
const PROBABILITY_THRESHOLD = 0.1;
let secretsFound = 0;
let secretsTotal = 5;

$(document).ready(setup);

// setup
//
// Setups the update intervals, the spans' click and secret mouseover events and updates the secretsTotal
function setup() {
  setInterval(update, INTERVAL_LENGTH);
  $spans = $('span').not(".secret, #foundSecrets, #totalSecrets");
  $spans.on("click", spansClicked);
  $secrets = $(".secret");
  $secrets.on("mouseover", mouseOverSecret);
  secretsTotal = $secrets.length;
  updateTotalSecrets();
}

// update
//
// Callback function that is called by INTERVAL_LENGTH, calling updateSpans for each span in the $spans JQuery Object 
function update() {
  $spans.each(updateSpans);
} 

// updateTotalSecrets
//
// Updates the span container for total secrets with the number of spans with a secret class
function updateTotalSecrets() {
  $('#totalSecrets').text(secretsTotal);
}

// updateSpans()
//
// Randomly (as per PROBABILITY_THRESHOLD's probability value) removes the target event's span class "redacted" and reveals it
function updateSpans() {
  if(Math.random() <= PROBABILITY_THRESHOLD) {
    $(this).removeClass("redacted");
    $(this).addClass("revealed");
  } 
}

// spansClicked()
//
// Removes revealed class and adds redacted class on a span with the revealed class
function spansClicked() {
  $(this).removeClass("revealed"); 
  $(this).addClass("redacted");
}

// mouseOverSecret()
//
// Event handler for mouseover a span with class secret
function mouseOverSecret() {
  $(this).addClass("foundSecret");
  $(this).off();
  updateSecretsFound();
}

// updateSecretsFound()
//
// Updates the text nodes of span with id = 'secretsFound'  
function updateSecretsFound() {
  secretsFound++;
  $('#foundSecrets').text(secretsFound);
}