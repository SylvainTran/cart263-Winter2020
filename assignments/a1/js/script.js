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
  pixels = document.querySelectorAll('.pixel');
}

function paint(e) {
  let r = Math.floor(Math.random() * 255);
  let g = Math.floor(Math.random() * 255);
  let b = Math.floor(Math.random() * 255);

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