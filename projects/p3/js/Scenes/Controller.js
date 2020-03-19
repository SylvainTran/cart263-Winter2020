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

  //createMoment(key, moment)
  //@args: key {string}, moment {Phaser.Scene}
  //creates moment using the key and moment parameters
  createMoment(key, moment)
  {
    const leftMargin = 100;
    const topMargin = 100;
    // Create a random range to spawn the game moments in the main canvas
    let x = Phaser.Math.Between(leftMargin, window.innerWidth);
    let y = Phaser.Math.Between(topMargin, window.innerHeight);
    
    // Create a parent zone for touch and dragging the scene
    let draggableZoneParent = this.add.zone(x, y, moment.WIDTH, moment.HEIGHT).setInteractive({ draggable: true }).setOrigin(0);
    // Create the instance and setup the drag handling
    let momentInstance = new moment(key, draggableZoneParent);
    this.handleDrag(draggableZoneParent, momentInstance);
    // Set a name for the zone (used for handling it later)
    draggableZoneParent.setName(key);
    this.scene.add(key, momentInstance, true);
  }

  //handleDrag(draggableZoneParent, momentInstance)
  //@args: draggableZoneParent {GameObject.Zone}, momentInstance {Phaser.Scene}
  //handle dragging behaviour event on each momentInstance created, by using the draggableZoneParent gameObject
  handleDrag(draggableZoneParent, momentInstance) {
    draggableZoneParent.input.draggable = true;
    draggableZoneParent.input.alwaysEnabled = true;
    this.input.enableDebug(draggableZoneParent);
    this.input.setDraggable(draggableZoneParent);
    this.input.on('drag', (function (pointer, gameObject, dragX, dragY) {
      console.debug("Dragging: " + gameObject.name);
      gameObject.x = dragX;
      gameObject.y = dragY;
      momentInstance.refresh();
      // On drag, suggest nearest nodes/moments to "connect with"
      // get the (x, y) pos of each scene/moment that exists in the game, put it in a list (that will be ordered)
      let displayedSceneList = this.scene.children;
      let draggableZonesActive = [];
      // cache only the Zones gameObjects that are active <- for now
      for (const element of displayedSceneList.list) {
        if(element.type === 'Zone' && element.active)
        {
          draggableZonesActive.push(element);
          // Find nearest zone from this gameObject being dragged
        }
      }
      console.log(draggableZonesActive);  

      // all nodes start separated
      // the scene used to drag first is first in the list
      // the next one appended is the second in the order, and so on
    })); // end of drag
  }

  update(time, delta) {

  }
}