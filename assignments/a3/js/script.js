"use strict";

/********************************************************************

Assignment 3 - Slamina Special
Sylvain Tran

Sometimes it works, sometimes it doesn't. This game is a beautiful metaphor
of life and love.

*********************************************************************/
$(document).ready(setup);
let animals =
    [
      "aardvark",
      "alligator",
      "alpaca",
      "antelope",
      "ape",
      "armadillo",
      "baboon",
      "badger",
      "bat",
      "bear",
      "beaver",
      "bison",
      "boar",
      "buffalo",
      "bull",
      "camel",
      "canary",
      "capybara",
      "cat",
      "chameleon",
      "cheetah",
      "chimpanzee",
      "chinchilla",
      "chipmunk",
      "cougar",
      "cow",
      "coyote",
      "crocodile",
      "crow",
      "deer",
      "dingo",
      "dog",
      "donkey",
      "dromedary",
      "elephant",
      "elk",
      "ewe",
      "ferret",
      "finch",
      "fish",
      "fox",
      "frog",
      "gazelle",
      "gila monster",
      "giraffe",
      "gnu",
      "goat",
      "gopher",
      "gorilla",
      "grizzly bear",
      "ground hog",
      "guinea pig",
      "hamster",
      "hedgehog",
      "hippopotamus",
      "hog",
      "horse",
      "hyena",
      "ibex",
      "iguana",
      "impala",
      "jackal",
      "jaguar",
      "kangaroo",
      "koala",
      "lamb",
      "lemur",
      "leopard",
      "lion",
      "lizard",
      "llama",
      "lynx",
      "mandrill",
      "marmoset",
      "mink",
      "mole",
      "mongoose",
      "monkey",
      "moose",
      "mountain goat",
      "mouse",
      "mule",
      "muskrat",
      "mustang",
      "mynah bird",
      "newt",
      "ocelot",
      "opossum",
      "orangutan",
      "oryx",
      "otter",
      "ox",
      "panda",
      "panther",
      "parakeet",
      "parrot",
      "pig",
      "platypus",
      "polar bear",
      "porcupine",
      "porpoise",
      "prairie dog",
      "puma",
      "rabbit",
      "raccoon",
      "ram",
      "rat",
      "reindeer",
      "reptile",
      "rhinoceros",
      "salamander",
      "seal",
      "sheep",
      "shrew",
      "silver fox",
      "skunk",
      "sloth",
      "snake",
      "squirrel",
      "tapir",
      "tiger",
      "toad",
      "turtle",
      "walrus",
      "warthog",
      "weasel",
      "whale",
      "wildcat",
      "wolf",
      "wolverine",
      "wombat",
      "woodchuck",
      "yak",
      "zebra"
    ];

let correctAnimal = "";
let answers = [];
const NUM_OPTIONS = 3;
let backwardsText = "";

// setup()
//
// setups annyang and inits the commands needed. Starts listening. Starts a new round
// and also inits the score display
function setup() {
  // Initialise annyang with no commands (because we just want to listen to whatever it hears)
  if(annyang)
  {
    // inits the commands
    annyang.init(commands, true);
    annyang.init(playerGuess, false);

    // Add our commands to annyang (separated for clarity)
    annyang.addCommands(commands);
    annyang.addCommands(playerGuess);

    // Start listening
    annyang.start();
  }
  newRound();
  updateScore();
}

// removeDivs()
//
// Removes the guess divs. Called when setting a new round
function removeDivs() {
  $('.guess').remove();  
}

// newRound()
//
// Start a new round by clearing existing answer divs, creating new answer divs and a correct one.
function newRound() {
  removeDivs();
  updateScore();
  answers = [];
  let randomCorrect = Math.floor(Math.random() * answers.length);

  for(let i = 0; i < NUM_OPTIONS; i++) 
  {
    let randomIndex = Math.floor(Math.random() * animals.length);
    let randomAnimal = animals[randomIndex];
    let thisButton = addButton(randomAnimal);
    answers.push(randomAnimal);

    // Checks if this div is gonna be the correct answer, if so add a class for correctAnimal for easy retrieval
    if(i === randomCorrect)
    {
      correctAnimal = answers[i];
      console.log(correctAnimal);
      thisButton.addClass("correctAnimal");
    }
  }
  sayBackwards(correctAnimal);
}

// options()
//
// Options for rate and pitch be random for some reason
let options = {
  "rate": Math.random(),
  "pitch": Math.random()
}

// handleGuess()
//
// Handle the guesses via clicking -- if it's the correct one, remove the guesses
function handleGuess() {
  if($(this).text() === correctAnimal) {
    $('.guess').remove();
    consecutiveScore++;
    updateScore();
    setTimeout(newRound, 2000);
  }
  else 
  {
    consecutiveScore = 0;
    $(this).effect('shake');
    responsiveVoice.speak(backwardsText, "UK English Male", options);
  }
}

// sayBackwards()
//
// Say the provided text arg backwards
function sayBackwards(text) {
  backwardsText = text.split('').reverse().join('');
  responsiveVoice.speak(backwardsText, "UK English Male", options);
}

// addButton()
//
// Creates and appends a button with the guess class and a click handler, and returns its reference for later use
function addButton(label) {
  let $div = $('<div></div>');
  $div.addClass("guess");
  $div.text(label);
  $div.button();
  $div.on("click", handleGuess);
  $('body').append($div);
  return $div;
}

// shakeCorrectDiv()
//
// Shake the correct div (the one with the correctAnimal class)
function shakeCorrectDiv() {
  $('.correctAnimal').effect("shake");
}

// Annyang commands and the number of times having answered correctly
let vocalGuess;
let consecutiveScore = 0;

// These actually worked (I swear) but it's unreliable and one needs
// to speak like something is stuck up its arse
// (and also with perfect slow and articulated pronunciation)
let commands = {
  'I give up': function() {
    consecutiveScore = 0;
    shakeCorrectDiv();
    setTimeout(newRound, 1000);
  },
  'Say it again': () => {
    responsiveVoice.speak(backwardsText, "UK English Male", options);
  },
}

// Checks the player's guess
// Increases score if gotten correctly
// Calls a new round after updating the score. If failed, reset score and start a new round
let playerGuess = {
  'I think it is *vocalGuess': function(vocalGuess) {
    if(vocalGuess === correctAnimal) {
      alert("Correct");
      consecutiveScore++;
      updateScore();
      newRound();
    }
    else
    {
      consecutiveScore = 0;
      updateScore();
    }
  }
}
// updateScore()
//
// Updates the score display
function updateScore()
{
  $('#score').text("Score: " + consecutiveScore);
}

// options()
//
// Options for rate and pitch be random for some reason
let options = {
  "rate": Math.random(),
  "pitch": Math.random()
}
