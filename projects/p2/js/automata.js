  class Automata {
    constructor(serialNumber)
    {
      this.serialNumber = serialNumber;
      this._fsm();
    }

    speak() 
    {
      console.log("My serial number is " + this.serialNumber + ". My Current state is: " + this.state);
    }
  }

  StateMachine.factory(Automata, {
    init: 'idle',
    transitions: [
      { name: 'busy',     from: 'idle',  to: 'laboring' },
      { name: 'fatigued',   from: 'laboring', to: 'idle'  }
    ],
    methods: {
      onBusy: 
        () => {console.log('I\'m busy');},
      onFatigued:   
        () => {console.log('I\'m fatigued.');}
    }
  });