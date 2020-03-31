// StateMachine
//
// To separate different stateArray. From P2
class StateMachine {
  constructor(enterState, stateArray, context) {
    this.enterState = enterState;
    this.stateArray = stateArray;
    this.context = context;
    this.state = null;

    for (const state of Object.values(this.stateArray)) {
      state.stateMachine = this;
    }
  }
  // Step into the state (called on each Phaser update frame)
  step(context) {
    if (this.state === null) {
      this.state = this.enterState;
      this.stateArray[this.state].enter(...this.context);
    }
    this.stateArray[this.state].execute(...context);
  }
  // Transition into a given state (called conditionally)
  transition(newState, context) {
    this.state = newState;
    this.context = context;
    this.stateArray[this.state].enter(...context);
  }
}

// Player stateArray  
class PlayerIdleState extends State {
  enter(scene, player) {
    console.log("Player is Idle");
  }

  execute(scene, player) {

  }
}

//Player's moving state
class MovingState extends State {
  enter(scene, player) {
    console.log("Player is starting to move");
  }

  execute(scene, player) {

  }
}