  class Automata extends Phaser.GameObjects.Sprite {
    constructor(config)
    {
      super(config.scene, config.x, config.y, "automata");
      config.scene.add.existing(this);
    }

    speak() 
    {
      console.log("My serial number is " + this.serialNumber + ". My Current state is: " + this.state);
    }
  }