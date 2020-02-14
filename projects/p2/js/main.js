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
            Actions are assigned weights of importance, in the Automata's GOAP priorities.
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
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
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

function preload ()
{
    // Nothing for now
}

function create ()
{

}

function update ()
{
}

class AutomataManager {
    constructor(name, positionX, positionY, velocity, tasksList, deviantBehaviors) {
        this.name = name;
        this.positionX = positionX;
        this.positionY = positionY;
        this.velocity = velocity;
        this.tasksList = tasksList;
        this.deviantBehaviors = deviantBehaviors;    
    }

    getTasksList() {
        return this.tasksList;
    }

    startMoveRoutine() {
        console.log("Starting move routine.");
    }

    startAutoRoutine() {
        console.log("Starting auto routine.");
        let routineLength = 4;
        let randomTask = Math.floor(Math.random() * routineLength);
        let newTask = this.tasksList[randomTask];
        let taskFound = window[newTask];
        if (typeof taskFound === "function") 
        {
            this.taskFound();
        }
    }

    inspect() {
        console.log("Manager Automata is inspecting the floor.");
    }

    cleanFloor() {
        console.log("Manager Automata" + this.name + "is cleaning the floor.");
    }

    superviseMinionAutomatas() {
        console.log("Manager Automata" + this.name + "is supervising minion Automatas.");
    }

    workOnBoxes() {
        console.log("Manager Automata" + this.name + "is working on boxes.");
    }

    observeManager() {
        console.log("Manager Automata" + this.name + "is observing the human manager.");
    }

    grab(){
        console.log("Manager Automata" + this.name + "is grabbing something.");
    }
}

function start() {
    let name = "TestMe"; // To be assigned by player
    let tasksList = ["inspect", "superviseMinionAutomatas", "workOnBoxes", "cleanFloor"];
    let deviantBehaviors = ["observe manager", "grab"];
    let automataManager = new AutomataManager(name, 0, 0, 5, tasksList, deviantBehaviors);
    //setTimeout(automataManager.startAutoRoutine, 1000); // Start off a new routine task every 5 seconds
    //automataManager.startMoveRoutine();  
}
