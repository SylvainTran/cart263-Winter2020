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
    
    // Create a parent zone for touch and dragging the scene
    let draggableZoneParent = this.add.zone(x, y, moment.WIDTH, moment.HEIGHT).setInteractive({ draggable: true }).setOrigin(0);
    // Create the instance and setup the drag handling
    let momentInstance = new moment(key, draggableZoneParent);
    draggableZoneParent.input.draggable = true;
    draggableZoneParent.input.alwaysEnabled = true;
    this.input.enableDebug(draggableZoneParent);
    this.input.setDraggable(draggableZoneParent);
    draggableZoneParent.on('drag', (pointer, dragX, dragY) => { 
      console.log('Dragging a moment.');
      this.x = dragX;
      this.y = dragY;
      momentInstance.refresh();
    });   
    this.scene.add(key, momentInstance, true);
  }

  update(time, delta) {

  }
}