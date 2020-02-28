"use strict";

/********************************************************************

Project 2: Something is wrong on the Internet
Sylvain Tran

references:
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
    scene: {
        preload: preload,
        create: create,
        update: update
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

//handleMessageDialog
//
//
function handleMessageDialog() {
    let text2 = "You have a new quest.";
    createDialog("New Quest", text2, "Accept", "Accept", null, closeDialog);
}

//closeDialog
//
//Closes this dialog
function closeDialog() {
    $(this).dialog("close");
}
  
//createDialog(title, text, button1, button2, button1Event, button2Event)
//
//creates a generic dialog with the provided args
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

function rotateMe() {
    console.log("Rotating - collided");
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
        responsiveVoice.speak("Cleaning up the floor, sir.", "UK English Female", options);
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
  
  