  class Automata extends Phaser.GameObjects.Sprite {
    constructor(config)
    {
      super(config.scene, config.x, config.y, "automata");
      config.scene.add.existing(this);
      this.AutomataFSM = new StateMachine('idle', automataStates, [this, this.player]);
    }

    speak() 
    {
      console.log("My serial number is " + this.serialNumber + ". My Current state is: " + this.state);
    }
  }

  function rotateMe() {
    console.log("Rotating - collided!!!!");
    // Animate each automaton
    setTimeout(() => { automatons.getChildren().forEach(automata => {
        automatons.rotate(-Math.PI/8); // 2, 25, 50, 200  
        // TODO play laboring animation
        // TODO Sweep up closest dirt pile
    });}, 1000);
  }