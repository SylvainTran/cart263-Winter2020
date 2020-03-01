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
        BootScene, Vacation
    ]
};

let automataConfig = {
    x: 300,
    y: 400,
    sprite: "automata" 
};

let game = new Phaser.Game(config);
let player;
let cursors;
let automatons;
const NB_AUTOMATA = 30;
let state;
const intervalToCallNewDialog = 1000;

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

function update ()
{
    this.stateMachine.step();
    checkMovement(); //To put in the fsm
}

function checkMovement()
{
    // Horizontal
    if(cursors.left.isDown)
    {
        player.setVelocityX(-160);
    }
    else if(cursors.right.isDown)
    {
        player.setVelocityX(160);
    }
    else
    {
        player.setVelocityX(0);
    }

    // Vertical
    if(cursors.up.isDown)
    {
        player.setVelocityY(-160);
    }
    else if(cursors.down.isDown)
    {
        player.setVelocityY(160);
    }
    else
    {
        player.setVelocityY(0);
    }
}

  
  