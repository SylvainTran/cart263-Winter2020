/**
* 
THE DREAM OF A RIDICULOUS MAN

A GAME ON THE SADNESS OF LIFE
...

Author: Sylvain Serey Tran
PROJECT FOR CART 263 - WINTER 2020, BY DR. PIPPIN BAR

Copyright/Attribution Notice: 
Music (piano theme): HitCtrl
Click on scene: p0ss
Link button: NenadSimic
Entering a Scene Dimension (Epic Amulet Item): CosmicD
Footstep (Dirt, Water): Little Robot Sound Factory
Animated book by gkhnsolak
Creatures by Luis Zuno (@ansimuz)
Through Pixelated Clouds by bart - https://opengameart.org/content/through-pixelated-clouds-8-bit-airship-remix
*/

// Config file for phaser
//
// Physics to arcade
let config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#ffffff',
  disableContextMenu: true,
  scale: {
    parent: 'main__world-node-container',
    mode: Phaser.Scale.CENTER_BOTH,
    width: 640,
    height: 640
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: {
        y: 0
      }
    }
  },
  dom: {
    createContainer: true
  },
  scene: [
    Preloader, Controller, World, UI, Hud
  ]
};
let game = new Phaser.Game(config);

$('document').ready(setup);

let $hamburgerMenu;
let $navBar;
let sticky;
// If two moments are currently linked
let updateDataAndActiveConnections = false;
let createLink = false;

function setup() {
  $hamburgerMenu = $('.nav__hamburger-menu');
  $navBar = $('#navBar');
  const STICKY_OFFSET = 10;
  sticky = $hamburgerMenu.offset().top - STICKY_OFFSET;
  window.onscroll = function () {
    handleNav();
  };
}

function handleNav() {
  if (window.pageYOffset >= sticky) {
    $navBar.addClass('sticky');
    $hamburgerMenu.addClass('sticky');
  } else {
    $navBar.removeClass('sticky');
    $hamburgerMenu.removeClass('sticky');
  }
}

// handleFormSubmit
//
// handles the form submission from questionnaires
function handleFormSubmit(form) {
  alert("Test");
  let userAnswer;
  // Save the user's answer to local storage
  let answeredForm = form.elements["likert-a"];
  let currentProgression = JSON.parse(localStorage.getItem("gameProgression"));
  console.log(currentProgression);
  for(let i = 0; i < answeredForm.length; i++) {
    if(answeredForm[i].checked) {
      userAnswer = answeredForm[i].value;
      currentProgression.questionsAnswered++;
      // Todo push question as well
      currentProgression.peopleQuestionsLikertA.push(userAnswer);
      localStorage.setItem("gameProgression", JSON.stringify(currentProgression));
    }
  }
  $(".game__agreeForm").remove();
  return false;
}

// Game progression data
let gameProgression = {
  peopleQuestionsLikertA: [],
  animalQuestionsLikertA: [],
  inanimateQuestionsLikertA: [],
  secretGriefsSolved: 0,
  meaningfulConversationsHad: 0,
  questionsAnswered: 0,
  questionsAvoided: 0,
  peopleDiscovered: 0,
  animalsDiscovered: 0,
  inanimateDiscovered: 0,
  chaptersUncovered: 0,
  bookCompletion: 0
}
