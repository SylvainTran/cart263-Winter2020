class Controller extends Phaser.Scene { 
  constructor() {
    super({key: 'Controller'});
  }

  init() {

  }

  preload() {

  }

  create() {
    // Create the main canvas that will hold other pocket games     
    this.createMainCanvas(true);
    // Add the other scenes
    this.scene.add('CriticalHit', CriticalHit, true);
    this.scene.add('GoodNPCPunchLine', GoodNPCPunchLine, true);
    this.scene.add('RareLoot', RareLoot, true);
    this.scene.start('World');
  }

  createMainCanvas(addToActiveDisplay) {
    this.World = new World('World');
    this.scene.add('World', World, addToActiveDisplay);
    console.log("Added main canvas world.");
  }

  update(time, delta) {

  }
}