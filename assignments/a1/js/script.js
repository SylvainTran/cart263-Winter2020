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
  e.target.style.backgroundColor = "white";
  setTimeout(resetPixel, delayToReset, e);
}

function resetPixel(e) {
  e.target.style.backgroundColor = "black";
}
