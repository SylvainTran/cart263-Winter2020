"use strict";

/*****************
Circle Eater
Pippin Barr
A simple game in which the player controls a shrinking circle with their mouse and tries
to overlap another circle (food) in order to grow bigger.
******************/

// Constants defining key quantities
const PLAYER_SIZE_GAIN = 50;
const PLAYER_SIZE_LOSS = 1;
const YELLOW_GRASS_COLOR = '#cccc55';
const FADED_BLUE_COLOR = '#55cccc';
const GOLD_COLOR = "#ffd000";
const WHITE_COLOR = "#ffffff";
const ORANGE_COLOR = "#ffc06e";
const MINIMUM_SIZE = 0;
// Simple FSM
let PlayerState = null;
let currentPlayerState = null;

// Player is an object defined by its properties
let player = null;
// Food is an object defined by its properties
let food = null;

let score = {
  x: window.innerWidth/2,
  y: window.innerHeight/2,
  size: 200,
  color: GOLD_COLOR,
  value: 0,
  increaseValue: 1
}

let titleScreen = {
  textSize: 100,
  color: WHITE_COLOR,
  bgColor: ORANGE_COLOR,
  menu: ["The Fresh Game", "Click anywhere to play"],
  titleTextPos: window.innerHeight/2,
  instrucTextPos: window.innerHeight/2 + 200
}

let gameScreen = {}

let gameOverScreen = {
  textSize: 100,
  color: WHITE_COLOR,
  bgColor: ORANGE_COLOR,
  menu: ["GAME OVER", "Click anywhere to replay"],
  titleTextPos: window.innerHeight/2,
  instrucTextPos: window.innerHeight/2 + 200
}

// setup()
//
// Create the canvas, position the food, remove the cursor

function setup() {
  createCanvas(windowWidth, windowHeight);
  player = new Player(0, 0, 64, YELLOW_GRASS_COLOR, 64);
  food = new Food(0, 0, 64, FADED_BLUE_COLOR);
  food.positionFood();
  noCursor();
  // Object deconstruction... on strings. Should become actual objects later, using more complex FSM version
  PlayerState = new HashTable({Title: "Title", Active: "Active", GameOver: "GameOver"});
  currentPlayerState = PlayerState.getItem('Title');
}


// draw()
//
// Move the player, check for collisions, display player and food

function draw() {
  // Simple FSM
  switch(currentPlayerState) {
    case "Title":
      push();
      background(titleScreen.bgColor);
      textSize(titleScreen.textSize);
      textAlign(CENTER, CENTER);
      fill(titleScreen.color);
      text(titleScreen.menu[0], window.innerWidth/2, titleScreen.titleTextPos);
      text(titleScreen.menu[1], window.innerWidth/2, titleScreen.instrucTextPos);
      pop();
      startGame();
      break;
    case "Active":
      push();
      background(0);
      player.updatePlayer();
      console.log(player.x + " " + player.y);
      player.checkCollision();
      player.display();
      food.display();
      displayScore();
      pop();
      break;
    case "GameOver":
      push();
      background(gameOverScreen.bgColor);
      textSize(gameOverScreen.textSize);
      textAlign(CENTER, CENTER);
      fill(gameOverScreen.color);
      text(gameOverScreen.menu[0], window.innerWidth/2, gameOverScreen.titleTextPos);
      text(gameOverScreen.menu[1], window.innerWidth/2, gameOverScreen.instrucTextPos);
      pop();
      startGame();
      break;
    default:
      break;
  }  
}

// increaseScore()
//
// Increase the score after the player has eaten a food
function increaseScore() {
  score.value += score.increaseValue;
}

// displayScore()
//
// Increase the score after the player has eaten a food
function displayScore() {
  push();
  fill(score.color);
  textSize(score.size);
  textAlign(CENTER, CENTER);
  text(score.value, score.x, score.y);
  pop();
}

// startGame()
//
// Resets the game
function startGame() {
  if(mouseIsPressed) {
    currentPlayerState = PlayerState.getItem('Active');
    score.value = 0;
    player.size = player.maxSize;
  }
}