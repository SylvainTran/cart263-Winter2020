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

//spawnDirt(scene)
//
//spawn dirty youtube videos for the robots to collect maybe
function spawnDirt(scene) {
    const DIRT_MULTIPLIER = 10;
    let NB_OF_DIRT_PILES = Math.floor(Math.random() * DIRT_MULTIPLIER);
    console.log(NB_OF_DIRT_PILES);
    let dirtyArray = Array(NB_OF_DIRT_PILES).fill(null).map( (x, i) => i );
    console.log(dirtyArray.length);

    dirtyArray.forEach((d) => {
        console.log("Spawning new Youtube Dirt Pile");
        let randomXY = [Math.random() * 480, Math.random() * 720];
        scene.add.YoutubeDirtPile(randomXY[0], randomXY[1]);
    });
}

  
function createNewYoutubeContent () {
    // Spawn new dirty and mindless youtube video for people to consume
    setTimeout(() => {
        //spawnDirt(game.scene.get(create));
    }, INTERVAL_NEW_TASK_SPAWN);
}

function rotateMe() {
    console.log("Rotating - collided!!!!");
    // Animate each automaton
    setTimeout(() => { automatons.getChildren().forEach(automata => {
        automatons.rotate(-Math.PI/8); // 2, 25, 50, 200  
        // TODO play laboring animation
        // TODO Sweep up closest dirt pile
    });}, 1000);
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

  
  