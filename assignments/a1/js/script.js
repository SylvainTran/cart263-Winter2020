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
const rotationValue = 1; // in degrees
let rotation = 0;
let pixels;
let currentKey = "";

document.addEventListener("keydown", rotate);
document.addEventListener("keydown", typed);

// setup
//
// Setups the div DOM nodes along with their class, listener events. Stores all pixel divs in 'pixels'.
function setup() {
  console.log("Setup called");

  for(let i = 0; i < numberOfPixels; i++) {
    let pixel = document.createElement("DIV");
    pixel.setAttribute("class", "pixel");
    pixel.addEventListener("mouseover", paint);
    pixel.addEventListener("mouseover", addText);
    pixel.addEventListener("click", removePaint)
    document.body.appendChild(pixel);
  }
  pixels = document.querySelectorAll('.pixel');
}

// paint(e)
//
// Changes the background style of the target div to a random rgb value, resets color after a timeout.
function paint(e) {
  let r = Math.floor(Math.random() * 255);
  let g = Math.floor(Math.random() * 255);
  let b = Math.floor(Math.random() * 255);

  e.target.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  setTimeout(resetPixel, delayToReset, e);
}

// resetPixel(e)
//
// Resets background color.
function resetPixel(e) {
  e.target.style.backgroundColor = "black";
}

// removePaint(e)
//
// Changes the opacity of the e.target to 0 to create an erased effect.
function removePaint(e) {
  e.target.style.opacity = "0";
}

// rotate(e)
//
// Rotates all pixels left or right in degrees.
function rotate(e) {
  if(e.keyCode === 37) { // Left
    // Counter-clockwise 
    rotation -= rotationValue;
    pixels.forEach(pixel => {
      pixel.style.transform = `rotate(${rotation}deg)`
    });
  }
  else if(e.keyCode === 39) { // Right
    // Clockwise
    rotation += rotationValue;
    pixels.forEach((pixel) => {
      pixel.style.transform = `rotate(${rotation}deg)`
    }); 
  } 
}

// typed(e)
//
// Updates the currentKey with the keydown keyCode pressed.
function typed(e) {
  currentKey = e.keyCode;
  console.log(currentKey);
}

// addText(e)
//
// Replaces the emptiness inside the div's text node child with the currentKey pressed.
function addText(e) {
  e.target.innerHTML = currentKey;
  console.log(e.target.innerHTML + "Working");
}