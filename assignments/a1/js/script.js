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

function setup() {
  console.log("Setup called");

  for(let i = 0; i < numberOfPixels; i++) {
    let pixel = document.createElement("DIV");
    pixel.setAttribute("class", "pixel");
    pixel.addEventListener("mouseover", paint);
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

// Challenges
// Choose the painting color randomly each time the user paints a pixel (remember we use Math.random() in regular JavaScript to get a number between 0 and 1)
