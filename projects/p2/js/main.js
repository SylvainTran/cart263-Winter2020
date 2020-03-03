"use strict";

/********************************************************************

Project 2: Something is wrong on the Internet
Sylvain Tran

references:
https://stackoverflow.com/questions/4852017/how-to-initialize-an-arrays-length-in-javascript
https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/
https://phaser.io/phaser3/devlog/119
*********************************************************************/
let config = {
    type: Phaser.AUTO,
    width: 480,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    plugins: {
        global: [
            { key: 'YoutubeDirtPile', plugin: YoutubeDirtPilePlugin, start: true }
        ]
    },
    scene: [
        BootScene, YoutubeLounge, UI
    ]
};

let automataConfig = {
    x: 300,
    y: 400,
    sprite: "automata" 
};
// player states
let playerStates = 
{
    idle: new PlayerIdleState(),
    moving: new MovingState()
}

// automata states
let automataStates = 
{
    idle: new IdleState(),
    laboring: new LaboringState(),
    exhausted: new ExhaustedState()
}  

let game = new Phaser.Game(config);
const intervalToCallNewDialog = 1000;
let workCommandIssued = false; // if the player has issued a voice command to work

$(document).ready(setup);

function setup() 
{
  setTimeout(handleMessageDialog, intervalToCallNewDialog);
  $('.side__left-menu__top').fadeIn(3000);

  // Accordions
  $('#side__left-menu__item--accordion-about').accordion({
      collapsible: true
  });
}