"use strict";

/********************************************************************

Pixel Painter
Sylvain Tran

This is a template. Fill in the title, author, and this description
to match your project! Write JavaScript to do amazing things below!

*********************************************************************/
window.onload = setup;
const numberOfPixels = 1000;
const delayToReset = 1000;
let rotation = 0;

document.addEventListener("keydown", rotate);

function setup() {
  console.log("Setup called");

  for(let i = 0; i < numberOfPixels; i++) {
    let pixel = document.createElement("DIV");
    pixel.setAttribute("class", "pixel");
    pixel.addEventListener("mouseover", paint);
    pixel.addEventListener("click", removePaint)
    document.body.appendChild(pixel);
  }
}

function paint(e) {
  let r = Math.floor(Math.random() * 255);
  let g = Math.floor(Math.random() * 255);
  let b = Math.floor(Math.random() * 255);

  console.log(r);

  e.target.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  setTimeout(resetPixel, delayToReset, e);
}

function resetPixel(e) {
  e.target.style.backgroundColor = "black";
}

function removePaint(e) {
  e.target.style.opacity = "0";
}

function rotate(e) {
  if(e.keyCode === 37) { // Left
    let pixels = document.querySelectorAll('.pixel');
    let currentRotation = document.
    let allPixelsStyle = window.getComputedStyle(document.body)
    pixels.forEach((pixel, i) => {
      pixel.getComputedStyle.
      pixel.style.transform = `rotate(1);`"
    });

  }
  else(e.keyCode === 39) {

  } // Right
}
// Challenges
// Choose the painting color randomly each time the user paints a pixel (remember we use Math.random() in regular JavaScript to get a number between 0 and 1)
// Add an event listener to all pixels for click that calls a function remove which removes the target pixel from the screen (in order to leave a "hole" you'll need to set the pixel's opacity to 0 rather than actually remove it)

// Add an event listener to the document for keydown that calls a function rotate that
