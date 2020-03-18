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
    // Add the other scenes/moments    
    this.createMoment('CriticalHit', CriticalHit);
    this.createMoment('GoodNPCPunchLine', GoodNPCPunchLine);
    this.createMoment('RareLoot', RareLoot);

    this.scene.start('World');
  }

  createMainCanvas(addToActiveDisplay) {
    this.World = new World('World');
    this.scene.add('World', World, addToActiveDisplay);
    console.log("Added main canvas world.");
  }

  createMoment(key, moment)
  {
    const leftMargin = 10;
    const topMargin = 10;
    // Create a random range to spawn the game moments in the main canvas
    let x = Phaser.Math.Between(leftMargin, window.innerWidth);
    let y = Phaser.Math.Between(topMargin, window.innerHeight);
    
    // Create each moment (deliberately called 'mom') for touch and dragging
    // Includes each touch-able zone
    let mom = this.add.zone(x, y, moment.WIDTH, moment.HEIGHT).setInteractive().setOrigin(0);
    // Create the instance and setup the drag handling
    let momentInstance = new moment(key, mom);
    this.input.setDraggable(mom);
    mom.on('drag', (pointer, dragX, dragY) => { 
      console.log('dragging moment');
      this.x = dragX;
      this.y = dragY;
    });   
    this.scene.add(key, momentInstance, true);
  }

  update(time, delta) {

  }
}