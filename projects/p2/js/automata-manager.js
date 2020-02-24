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
    let automataManager = new AutomataManager(tasksList);
    automataManager.startAutoRoutine();
    let allTasks = automataManager.getMethods(automataManager);
    console.log(allTasks);
}
