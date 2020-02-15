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
$(document).ready(start);

class AutomataManager {
    constructor(tasksList) {
        // this.name = name;
        // this.positionX = positionX;
        // this.positionY = positionY;
        // this.velocity = velocity;
        this.tasksList = tasksList;
        console.log(this.tasksList);
        // this.deviantBehaviors = deviantBehaviors;    
    }

    get tasksList() {
        return this._tasksList;
    }

    set tasksList(value) {
        this._tasksList = value;
    }

    getMethods = (obj) => {
        let properties = new Set()
        let currentObj = obj
        do {
            Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
        } 
        while ((currentObj = Object.getPrototypeOf(currentObj)))
        return [...properties.keys()].filter(item => typeof obj[item] === 'function')
    }

    startMoveRoutine() {
        console.log("Starting move routine.");
    }

    startAutoRoutine() {
        console.log("Starting auto routine.");
        console.log(`My tasks are to: ${this.tasksList}. Joy.`);
        let routineLength = 4;
        let randomTask = Math.floor(Math.random() * routineLength);  
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
    //console.log(tasksList);
    let automataManager = new AutomataManager(tasksList);
    //setTimeout(automataManager.startAutoRoutine, 1000); // Start off a new routine task every 5 seconds
    automataManager.startAutoRoutine();
    let allTasks = automataManager.getMethods(automataManager);  
    console.log(allTasks);
}
