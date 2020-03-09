// StateMachine
//
// To separate different states. Read tutorial from: https://www.mkelly.me/blog/phaser-finite-state-machine/
class StateMachine {
  constructor(init, states, stateArgs) {
    this.init = init;
    this.states = states;
    this.stateArgs = stateArgs;
    this.state = null; // This is a string ! Damn javascript
    // Assign a reference to this statemachine to each state
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
//Automata states only
class IdleState extends State {
  enter(scene, automata) {
    console.log("I'm Idle Like Stale Bread");
  }

  execute(scene, automata) {
    //if the player has issued a vocal command, decide if has enough money to act on it and create a youtube video based out of
    // financial incentives. If not, has a probability to create art or something else instead
    // This is hopefully going to be majorly redone later using better structuring and AI
    scene.workCommandIssued ? this.checkIfEnoughMoney(scene) : this.randomDecisionTree();
  }
  //Checks if enough money in the automata's inventory depending on the financial tolerance threshold (fearing poverty)
  checkIfEnoughMoney(automata) {
    console.log("Checking if enough money was offered");
    //console.log(automata.cashInventory);
    if (automata.getCashInventory() >= getFinancialToleranceThreshold()) {
      return true;
    } else {
      return false;
    }
  }
  //Random decision tree
  randomDecisionTree() {
    //console.log("making random decisions");
    setTimeout(() => this.stateMachine.transition("moving"), 5000);
  }
}
// These states are artefacts of the first ideation of the project, may be repicked later
class LaboringState extends State {
  enter(scene, automata) {

  }

  execute(scene, automata) {

  }
}
// These states are artefacts of the first ideation of the project, may be repicked later
class ExhaustedState extends State {
  enter(scene, automata) {

  }

  execute(scene, automata) {

  }
}
// The automata's moving states (NPCs movement)
class AutomataMovingState extends State {
  enter(scene, automata) {

  }
  // Move in a random direction
  execute(scene, automata) {
    let randomDirection = Math.floor(Math.random() * 4);
    switch (randomDirection) {
      case 1:
        automata.setVelocityX(-80);
        break;
      case 2:
        automata.setVelocityX(80);
        break;
      case 3:
        automata.setVelocityY(-80);
        break;
      case 4:
        automata.setVelocityY(80);
        break;
    }
  }
}
// Player states
class PlayerIdleState extends State {
  enter(scene, player) {
    console.log("Player is Idle");
  }

  execute(scene, player) {
    if (this.checkMovement(player)) {
      this.stateMachine.transition("moving");
    }
  }
  //Check the movement per the cursors object
  checkMovement(player) {
    if (player.cursors.left.isDown || player.cursors.right.isDown || player.cursors.up.isDown || player.cursors.down.isDown) {
      return true;
    } else {
      return false;
    }
  }
}
//Player's moving state
class MovingState extends State {
  enter(scene, player) {
    console.log("Player is starting to move");
  }

  execute(scene, player) {
    this.updateVelocity(scene, player);
  }
  // Update the velocity directly per case, and animations later on (some issue currently)
  updateVelocity(scene, player) {
    // Horizontal
    if (player.cursors.left.isDown) {
      player.setVelocityX(-80);
      player.play("ley-left-walk", true);
    } else if (player.cursors.right.isDown) {
      player.setVelocityX(80);
      player.play("ley-right-walk", true);
    } else if (player.cursors.up.isDown) {
      // Remove excess X velocity horizontally (awkward horizontal diagonal movement -- vertical diagonal still allowed)
      player.setVelocityX(0);
      player.setVelocityY(-80);
      player.play("ley-up-walk", true);
    } else if (player.cursors.down.isDown) {
      // Remove excess X velocity horizontally (awkward horizontal diagonal movement -- vertical diagonal still allowed)
      player.setVelocityX(0);
      player.setVelocityY(80);
      player.play("ley-front-walk", true);
    } else {
      player.setVelocityX(0);
      player.setVelocityY(0);
    }

    //If the player didn't move at all, then he is idle
    if (player.body.velocity.equals(new Phaser.Math.Vector2(0, 0))) {
      this.stateMachine.transition("idle");
    }
  }
}
