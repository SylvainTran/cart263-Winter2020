"use strict";

/********************************************************************

Title of Project
Author Name

This is a template. Fill in the title, author, and this description
to match your project! Write JavaScript to do amazing things below!

*********************************************************************/

$(document).ready(setup);

function setup() {
  console.log("Ready to setup");
  // This code will run when the document is ready!
  hideDivs();
}

function hideDivs() {
  $('div')
  .hide()
  .fadeIn(2000); // Chaining
  
  $('div').css({
    color: 'red',
    backgroundColor: 'green',
    fontSize: '2em'
  });

  $('div').slideToggle(callme);
}

function callme() {
  console.log("Called you");
}

