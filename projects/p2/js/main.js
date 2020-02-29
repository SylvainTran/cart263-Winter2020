"use strict";

/********************************************************************

Project 2: Something is wrong on the Internet
Sylvain Tran

references:
https://stackoverflow.com/questions/4852017/how-to-initialize-an-arrays-length-in-javascript
https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/
https://phaser.io/phaser3/devlog/119
*********************************************************************/
class BootScene extends Phaser.Scene {

    constructor () {
        super({
            key: 'boot',
            files: [
                { type: 'image', key: 'bar', url: 'loaderBar.png' },
                { type: 'image', key: 'bg', url: 'background.png' },
            ]
        });
    }

    init(data) {}
    preload () {}
    create (data)  {}
    update(time, delta) {}
}

class Vacation extends Phaser.Scene {

    constructor () {
        super("Vacation");
    }

    init(data) {}
    preload () {}
    create (data)  {}
    update(time, delta) {}
}

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
    scene: {
        BootScene: BootScene,
        Vacation: Vacation,
        preload: preload, //TODO put in bootscene
        create: create, //TODO put in bootscene
        update: update //TODO put in bootscene
    }
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

//handleMessageDialog
//
//handle message dialogues - From P1
function handleMessageDialog() {
    let text2 = "You have a new quest.";
    createDialog("New Quest", text2, "Accept", "Accept", null, closeDialog);
}

//closeDialog
//
//Closes this dialog - From P1
function closeDialog() {
    $(this).dialog("close");
}
  
//createDialog(title, text, button1, button2, button1Event, button2Event)
//
//creates a generic dialog with the provided args - From P1
function createDialog(title, text, button1, button2, button1Event, button2Event) {
    let newDialog = document.createElement("div");

    $(newDialog).addClass(".dialog");
    $(newDialog).attr("title", title);
    $(newDialog).text(text);
    $(newDialog).dialog({
        position: { my: "center top", at: "right top"},
        buttons: [
        {
            text: button1,
            click: button1Event
        },
        {
            text: button2,
            click: button2Event
        }
        ]
    });
}
  
function preload ()
{
    this.load.image("automata", "./assets/images/automata.png");
    this.load.image('YoutubeDirtPile', "./assets/images/sprites/YoutubeDirtPile.png");
}
// TODO add spritesheet animations/graphics
function create ()
{
    let camera = this.cameras.add(0, 0, 1280, 760);
    player = this.physics.add.sprite(400, 0, "automata");
    player.setCollideWorldBounds(true);
    automatons = this.physics.add.group();
    automatons.enableBody = true;
    automatons.physicsBodyType = Phaser.Physics.ARCADE;

    for(let i = 0; i < NB_AUTOMATA; i++)
    {
        let a = automatons.create(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 'automata');
        //a.body.immovable = true;
    }
    // Add event listeners    
    this.physics.add.collider(player, automatons);
    this.physics.add.collider(automatons, automatons);
    this.physics.add.collider(player, automatons, rotateMe, null, this);
    cursors = this.input.keyboard.createCursorKeys();

    let automataConfig = {
        x: 300,
        y: 400,
        sprite: "automata" 
    };
    let testAutomata = new Automata({scene:this, x: automataConfig.x, y: automataConfig.y});
    testAutomata.speak();

    // Animate each automaton
    setInterval(() => { automatons.getChildren().forEach(automata => {
        automatons.rotate(Math.PI/8); // 2, 25, 50, 200  
    });}, 1000);

    // states
    let automataStates = 
    {
        idle: new IdleState(),
        laboring: new LaboringState(),
        exhausted: new ExhaustedState()
    }
    // fsm
    this.stateMachine = new StateMachine('idle', automataStates, [this, this.player]);
    
    // Voice control
    if(annyang)
    {
      // inits the commands
      annyang.init(commands, true);
  
      // Add our commands to annyang (separated for clarity)
      annyang.addCommands(commands);

      // Start listening
      annyang.start();
    }

    // Append the phaser canvas in the flex box
    $('.main__game').append($('canvas'));
}

function createNewYoutubeContent () {
    // Spawn new dirty and mindless youtube video for people to consume
    setTimeout(() => {
        spawnDirt(game.scene.get(create));
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

let commands = {
    'Start working': function() {
        // if in a good mood or state, will obey
        responsiveVoice.speak("Cleaning up the floor, sir. New Content Uploaded.", "UK English Female", options);
        createNewYoutubeContent();
        rotateMe();
        // if not, disobey
        //responsiveVoice.speak("Nah, I won't do it.", "UK English Female", options);        
    },
    'Stop working': () => {
        responsiveVoice.speak("There wasn't much to do anyway.", "UK English Female", options);
    },
    'Take a stroll': () => {
        responsiveVoice.speak("Everyone deserves a good stroll", "UK English Female", options);        
    }
}

// options()
//
// Options for rate and pitch be random for some reason
let options = {
    "rate": Math.random(),
    "pitch": Math.random()
}
  
  