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

function setup() 
{
  snare = new Pizzicato.Sound("./assets/sounds/snare.wav");
  kick = new Pizzicato.Sound("./assets/sounds/kick.wav");
  hihat = new Pizzicato.Sound("./assets/sounds/hihat.wav");
}

function playNote() 
{
  let randFreq = Math.floor(Math.random() * frequencies.length);
  synth.frequency = frequencies[randFreq];
  synth.play();
}

function mousePressed() 
{
  console.log("Pizzicato");
  setInterval(playNote, 500);
}