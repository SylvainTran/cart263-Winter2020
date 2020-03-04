// StateMachine
//
// To separate different states. Read tutorial from: https://www.mkelly.me/blog/phaser-finite-state-machine/
class StateMachine {
    constructor(init, states, stateArgs)
    {
        this.init = init;
        this.states = states;
        this.stateArgs = stateArgs;
        this.state = null; // This is a string ! Damn javascript

        for (const state of Object.values(this.states))
        {
            state.stateMachine = this;
        }
    }

    step()
    {
      if (this.state === null)
      {
        this.state = this.init;
        this.states[this.state].enter(...this.stateArgs);
      }
      this.states[this.state].execute(...this.stateArgs);
    }

    transition(newState, ...enterArgs) {
      this.state = newState;
      this.states[this.state].enter(...this.stateArgs, ...enterArgs);
    }
  }

  // Base state class for specialized states
  class State {
    enter(scene, player)
    {

    }

    execute(scene, player)
    {

    }
  }
  //Automata states only
  class IdleState extends State {
      enter(scene, automata)
      {
        console.log("I'm Idle Like Stale Bread");
      }

      execute(scene, automata)
      {
        //if the player has issued a vocal command, decide if has enough money to act on it and create a youtube video based out of
        // financial incentives. If not, has a probability to create art or something else instead
        scene.workCommandIssued? this.checkIfEnoughMoney(scene) : this.randomDecisionTree();
      }

      checkIfEnoughMoney(automata)
      {
        console.log("Checking if enough money was offered");
        //console.log(automata.cashInventory);
        if(automata.getCashInventory() >= getFinancialToleranceThreshold())
        {
          return true;
        } else {
          return false;
        }
      }

      randomDecisionTree()
      {
        //console.log("making random decisions");
        setTimeout(() => this.stateMachine.transition("moving"), 5000);
      }
  }

  class LaboringState extends State {
    enter(scene, automata)
    {

    }

    execute(scene, automata)
    {

    }
}

class ExhaustedState extends State {
    enter(scene, automata)
    {

    }

    execute(scene, automata)
    {

    }
}

class AutomataMovingState extends State {
    enter(scene, automata)
    {

    }
    // Move in a random direction
    execute(scene, automata)
    {
      let randomDirection = Math.floor(Math.random() * 4);
      switch(randomDirection) {
        case 1: automata.setVelocityX(-80); break;
        case 2: automata.setVelocityX(80); break;
        case 3: automata.setVelocityY(-80); break;
        case 4: automata.setVelocityY(80); break;
      }
    }
}
// Player states
class PlayerIdleState extends State {
  enter(scene, player)
  {
    console.log("Player is Idle");
  }

  execute(scene, player)
  {
    if(this.checkMovement(player))
    {
      this.stateMachine.transition("moving");
    }
  }

  checkMovement(player)
  {
    if(player.cursors.left.isDown || player.cursors.right.isDown || player.cursors.up.isDown || player.cursors.down.isDown)
    {
      return true;
    }
    else
    {
      return false;
    }
  }
}

class MovingState extends State {
  enter(scene, player)
  {
    console.log("Player is starting to move");
  }

  execute(scene, player)
  {
    this.updateVelocity(scene, player);
  }

  updateVelocity(scene, player)
  {
    // Horizontal
    if(player.cursors.left.isDown)
    {
      player.setVelocityX(-80);
      //player.myAnims.play("ley-left-walk");
    }
    else if(player.cursors.right.isDown)
    {
      player.setVelocityX(80);
      //player.play("ley-right-walk");    
    }
    else
    {
      player.setVelocityX(0);
      //player.play("ley-front-walk");
    }

    // Vertical
    if(player.cursors.up.isDown)
    {
      player.setVelocityY(-80);
      //player.play("ley-up-walk");
    }
    else if(player.cursors.down.isDown)
    {
      player.setVelocityY(80);
      //player.play("ley-front-walk");;
    }
    else
    {
      player.setVelocityY(0);
      //player.play("ley-front-walk");
    }

    //If the player didn't move at all, then he is idle
    if(player.body.velocity.equals(new Phaser.Math.Vector2(0,0)) ) {
      this.stateMachine.transition("idle");
    }
  }
}
