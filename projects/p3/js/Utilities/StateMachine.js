// StateMachine
//
// To separate different states. Read tutorial from: https://www.mkelly.me/blog/phaser-finite-state-machine/
class StateMachine {
    constructor(init, states, stateArgs) {
      this.init = init;
      this.states = states;
      this.stateArgs = stateArgs;
      this.state = null;

      for (const state of Object.values(this.states)) {
        state.stateMachine = this;
      }
    }
    // Step into the state (called on each Phaser update frame)
    step() {
      if (this.state === null) {
        this.state = this.init;
        this.states[this.state].enter(...this.stateArgs);
      }
      this.states[this.state].execute(...this.stateArgs);
    }
    // Transition into a given state (called conditionally)
    transition(newState, ...enterArgs) {
      this.state = newState;
      this.states[this.state].enter(...this.stateArgs, ...enterArgs); // rest operator to simplify manipulation of args in classes -- pass the current scene and a ref to the player
    }
  }
  
  // Base state class for specialized states
  class State {
    // Called upon init
    enter(scene, player) {
  
    }
    // Called principally
    execute(scene, player) {
  
    }
  }

  // Player states
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