"use strict";

/*****************

Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

******************/
let sineWave = new Pizzicato.Sound({
    source: 'wave',
    options: {
      frequency: 440
    }
  });

let frequencies = [
  110.00,
  123.47,
  17.32,
  18.35,
  20.60,
  23.12,
  25.96
];

let synth = new Pizzicato.Sound({
  source: 'wave'
});

let kick, snare, hihat;
let pattern;
let drum1, drum2, drum3, drum4, drum5, drum6, drum7, drum8;
let beat = 0;

function setup() 
{
  snare = new Pizzicato.Sound("./assets/sounds/snare.wav"); // x
  kick = new Pizzicato.Sound("./assets/sounds/kick.wav"); // o
  hihat = new Pizzicato.Sound("./assets/sounds/hihat.wav"); // *

  drum1 = "x";
  drum2 = "o";
  drum3 = "*";
  drum4 = "x";
  drum5 = "o";
  drum6 = "*";
  drum7 = "*";
  drum8 = "x";

  pattern = [drum1,drum2,drum3,drum4,drum5,drum6,drum7,drum8];
}

function playNote() 
{
  let randFreq = Math.floor(Math.random() * frequencies.length);
  synth.frequency = frequencies[randFreq];
  synth.play();
}

function playDrums() 
{
  let symbol = pattern[beat];
  if(symbol.includes("x"))
  {
    snare.play();
  } 
  else if(symbol.includes("o"))
  {
    kick.play();
  }
  else if(symbol.includes("*"))
  {
    hihat.play();
  }
  beat++;
  if(beat >= pattern.length)
  {
    beat = 0;
  }
}

function mousePressed() 
{
  console.log("Pizzicato");
  setInterval(playNote, 500);
  setInterval(playDrums, 250);
}