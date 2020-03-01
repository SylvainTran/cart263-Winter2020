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
  
  // Base state class to be extended
  class State {
    enter() 
    {
        
    }
  
    execute(scene, player) 
    {
        
    }
  }
  //Automata states only
  class IdleState extends State {
      enter()
      {
        console.table(["I'm Idle"]);
      }

      execute(scene, player) 
      {
        
      }
  }

  class LaboringState extends State {
    enter()
    {

    }

    execute(scene, player) 
    {
        
    }
}

class ExhaustedState extends State {
    enter()
    {

    }

    execute() 
    {
        
    }
}

// Player states
class PlayerIdleState extends State {
  enter()
  {
    console.log("Player is Idle");
  }

  execute(scene, player) 
  {
    if(this.checkMovement())
    {
      this.stateMachine.transition("moving");
    }
  }

  checkMovement() 
  {
    if(cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown)
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
  enter()
  {
    console.log("Player is starting to move");
  }

  execute(scene, player) 
  {
    this.updateVelocity();
  }

  updateVelocity()
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
    
    //If the player didn't move at all, then he is idle
    if(player.body.velocity.equals(new Phaser.Math.Vector2(0,0)) ) {
      this.stateMachine.transition("idle");
    }
  }
}