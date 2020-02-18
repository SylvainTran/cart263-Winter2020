let fsm = new StateMachine({
    init: 'idle',
    transitions: [
      { name: 'busy',     from: 'idle',  to: 'laboring' },
      { name: 'fatigued',   from: 'laboring', to: 'idle'  }
    ],
    methods: {
      onBusy: 
        () => {console.log('I\'m busy')},
      onFatigued:   
        () => {console.log('I\'m fatigued.')}
    }
  });