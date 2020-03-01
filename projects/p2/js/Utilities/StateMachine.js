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
  
  class State {
    enter() 
    {
        
    }
  
    execute(scene, player) 
    {
        
    }
  }
  
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