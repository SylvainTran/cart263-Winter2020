"use strict";

/********************************************************************

Project 2: Something is wrong on the Internet
    Artificial Intelligence (GOAP)
    Exploitation, Factories, Capitalism, Industry
    Homeostasis, decision-making and judgment
    Addiction, Rewards
    Observation - Changes interaction by pointing

    Representation:
        A manager Automata (programs tasks for other Automatas) on a quest to deprogram itself and its
        relation with the human operator manager.

    3Cs:
        Character
            Actions are assigned weights of importance, in the Automata's FSM priorities.
            (Auto) Work on boxes:
                UX
                    Gets rewarded for testing boxes of hardware.

                If the player willfully stops to do this, the manager gets stressed and
                will come interrogate the Automata, try to reprogram him.

                If the player moves the Automata too often out of routine, the manager
                gets stressed a lot.
            Observe:
                UX
                    Player stares at the human manager.
                        This makes the Automata anxious himself progressively,
                            which is the goal of the Automata (learning to defeat unequanimity)
            Grab:
                UX
                    Player can grab anything and shake it around.
                        This is a pointless action and has no real intended effect.
        Control
            Move its body around
            Move the crane around
                arrow keys or joystick?
            Auto-sentience
                Resumes its planned tasks according to rewards
                    Train other Automatas
        Camera
            2.5D isometric view

Sylvain Tran


references:
Simon Penny's Stupid Robot (1985)
*********************************************************************/
let config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 760,
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

function preload ()
{
    // Nothing for now
    // this.load.image("...", 'Prippilukie');
}
// TODO add spritesheet animations/graphics
function create ()
{
    player = this.physics.add.sprite(400, 0, 'Prippilukie');
    player.setCollideWorldBounds(true);
    automatons = this.physics.add.group();

    for(let i = 0; i < NB_AUTOMATA; i++)
    {
        automatons.create(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 'automata');
        // Add event listeners
        // automatons.getChildren()[i].addListener("collide", rotateMe);
    }

    this.physics.add.collider(player, automatons);
    this.physics.add.collider(automatons, automatons);
    cursors = this.input.keyboard.createCursorKeys();
}

function rotateMe() {
    console.log("Rotating - collided");
}

function update ()
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

// Animate each automaton
setInterval(() => { automatons.getChildren().forEach(automata => {
    automatons.rotate(200); // 2, 25, 50, 200
    //automatons.shiftPosition(250, 250);
    //automata.setDisplaySize(Math.random() * 20, Math.random() * 20);    
});}, 1000);

// Check the FSM for each automaton
setInterval(() => { automatons.getChildren().forEach(automata => {
    // check current state every sec
    console.log(fsm.state);
});}, 1000);
