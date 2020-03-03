// StateMachine
//
// To separate different states. Read tutorial from: https://www.mkelly.me/blog/phaser-finite-state-machine/
class StateMachine {
    constructor(init, states, stateArgs) 
    {
        this.init = init;
        this.states = states;
        this.stateArgs = stateArgs;
        this.state = null;
        // this.workCommandIssued = false; // if the player has issued a voice command to work        

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
        workCommandIssued? this.checkIfEnoughMoney(scene) : this.randomDecisionTree();
      }
      
      checkIfEnoughMoney(automata) 
      {
        //console.log("Checking if enough money was offered");
        //console.log(automata.cashInventory);
      }

      randomDecisionTree()
      {
        //console.log("making random decisions");
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

// Player states
class PlayerIdleState extends State {
  enter(scene, player)
  {
    console.log("Player is Idle");
  }

  execute(scene, player) 
  {
    if(this.checkMovement(scene))
    {
      this.stateMachine.transition("moving");
    }
  }

  checkMovement(scene) 
  {
    if(scene.cursors.left.isDown || scene.cursors.right.isDown || scene.cursors.up.isDown || scene.cursors.down.isDown)
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
    this.updateVelocity(scene);
  }

  updateVelocity(player)
  {
    // Horizontal
    if(player.cursors.left.isDown)
    {
      player.setVelocityX(-80);
      //player.anims.play('left', true);
    }
    else if(player.cursors.right.isDown)
    {
      player.setVelocityX(80);
      //player.anims.play('right', true);
    }
    else
    {
      player.setVelocityX(0);
      //player.anims.play('turn', true);
    }

    // Vertical
    if(player.cursors.up.isDown)
    {
      player.setVelocityY(-80);
      //player.anims.play('up', true);
    }
    else if(player.cursors.down.isDown)
    {
      player.setVelocityY(80);
      //player.anims.play('turn', true);
    }
    else
    {
      player.setVelocityY(0);
      //player.anims.play('turn', true);
    }
    
    //If the player didn't move at all, then he is idle
    if(player.body.velocity.equals(new Phaser.Math.Vector2(0,0)) ) {
      this.stateMachine.transition("idle");
    }
  }
}