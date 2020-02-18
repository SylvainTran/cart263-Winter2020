"use strict";

/********************************************************************

Title of Project
Author Name

This is a template. Fill in the title, author, and this description
to match your project! Write JavaScript to do amazing things below!

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

function setup() {
  // Initialise annyang with no commands (because we just want to listen to whatever it hears)
  if(annyang)
  {
    annyang.init({});
    //annyang.addCallback('result', handleSpeech);
    // Add our commands to annyang
    annyang.addCommands(commands);
    annyang.addCommands(playerGuess);

    // Start listening. You can call this here, or attach this call to an event, button, etc.
    annyang.start();
  }

  newRound();
  updateScore();
}

function newRound() {
  updateScore();
  answers = [];
  let randomCorrect = Math.floor(Math.random() * answers.length);

  for(let i = 0; i < NUM_OPTIONS; i++) {
    let randomIndex = Math.floor(Math.random() * animals.length);
    let randomAnimal = animals[randomIndex];
    let thisButton = addButton(randomAnimal);
    answers.push(randomAnimal);

    if(i === randomCorrect)
    {
      correctAnimal = answers[i];
      console.log(correctAnimal);
      thisButton.addClass("correctAnimal");
    }
  }
  sayBackwards(correctAnimal);
}

let options = {
  "rate": Math.random(),
  "pitch": Math.random()
}

function handleGuess() {
  if($(this).text() === correctAnimal) {
    $('.guess').remove();
    setTimeout(newRound, 2000);
  }
  else {
    $(this).effect('shake');
    responsiveVoice.speak(backwardsText, "UK English Male", options);
  }
}

function sayBackwards(text) {
  backwardsText = text.split('').reverse().join('');
  responsiveVoice.speak(backwardsText, "UK English Male", options);
}

function addButton(label) {
  let $div = $('<div></div>');
  $div.addClass("guess");
  $div.text(label);
  $div.button();
  $div.on("click", handleGuess);
  $('body').append($div);
  return $div;
}

function shakeCorrectDiv() {
  $('.correctAnimal').shake();
}

let vocalGuess;
let consecutiveScore;

let commands = {
  'I give up': function() {
    alert("ok");
    consecutiveScore = 0;
    shakeCorrectDiv();
    newRound();
  },
  'Say it again': () => {
    responsiveVoice.speak(backwardsText, "UK English Male", options);
  },
}

let playerGuess = {
  "I think it is *vocalGuess": function() {
    if(vocalGuess === correctAnimal) {
      consecutiveScore++;
      newRound();
    }
    else
    {
      consecutiveScore = 0;
    }
  }
}

function updateScore()
{
  $('score').text("Score: " + consecutiveScore);
}