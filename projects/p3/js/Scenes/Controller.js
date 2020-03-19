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
    this.draggableZonesActive = [];
    // cache only the Zones gameObjects that are active <- for now
    for (const element of this.children.list) {
      if(element.type === 'Zone' && element.active)
      {
        this.draggableZonesActive.push(element);
      }
    }
    const momentWidth = 150; // TODO find a better way
    const momentHeight = 150;
    this.createLinkLine(momentWidth, momentHeight, 0, 0, 100, 100, 0xff0000, 5, true); // TODO fix visibility issue, should start invisible (false) but not settable to true after?  
  }

  //createLinkLine(...)
  //@args: many
  //creates a link line (must be set visible to be seen) when a dragged scene is in range of another scene
  // Also sets line width
  createLinkLine(x, y, x1, y1, x2, y2, color, width, visible) {
    this.scene.linkLine = this.add.line(x, y, x1, y1, x2, y2, color, visible).setOrigin(0)
      .setLineWidth(width);
  }

  setLinkLineVisible(visibility) {
    this.scene.linkLine.setVisible(visibility);  
  }

  updateLinkLinePos(x1, y1, x2, y2) {
    this.scene.linkLine.setTo(x1, y1, x2, y2);
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
    this.input.enableDebug(draggableZoneParent);
    draggableZoneParent.on('drag', (function (pointer, dragX, dragY) {
      //console.debug("Dragging: " + this.name);
      draggableZoneParent.setPosition(dragX, dragY);
      momentInstance.refresh();
      // Find nearest zone from this gameObject being dragged
      // Compare this go's pos (x, y) with each zone's pos (x, y) in draggableZonesActive
      // Refresh cache pos instead for optimization later
      const rangeToLink = 1000;
      let thisPosXY = this.getCenter();
      let currentMinNeighbour = 0;
      let tempClosestNeighbour;
      let lengthDragZonesActive = this.scene.draggableZonesActive.length;
      for (let i = 0; i < lengthDragZonesActive; i++) {
        currentMinNeighbour = i;
        for(let j = i + 1; j < lengthDragZonesActive; j++) { // TODO fix this I think
          console.debug("Closest neighbour: " + this.scene.draggableZonesActive[currentMinNeighbour].name);
          if(j != i && thisPosXY
            .distance(this.scene.draggableZonesActive[j]
              .getCenter()) < 
                thisPosXY
                  .distance(this.scene.draggableZonesActive[currentMinNeighbour]
                    .getCenter() ) ) 
          {
            console.debug("Is it ever true");
            currentMinNeighbour = j;
          }  
          if( 
            thisPosXY.
              distance(this.scene.draggableZonesActive[currentMinNeighbour]
                .getCenter()) 
                < rangeToLink) 
          {
            tempClosestNeighbour = this.scene.draggableZonesActive[i];
            this.scene.draggableZonesActive[i] = this.scene.draggableZonesActive[currentMinNeighbour];
            this.scene.draggableZonesActive[currentMinNeighbour] = tempClosestNeighbour;
            // Sets the visual link visible
            //this.scene.setLinkLineVisible(true);
            this.scene.updateLinkLinePos(this.x, this.y, this.scene.draggableZonesActive[currentMinNeighbour].x, this.scene.draggableZonesActive[currentMinNeighbour].y);
            // TODO update find nearest by sorting draggableZoneActive instead to fix current favoritist behavior
            // Cache the dragged go's current linked scene for ordering (distance among competiting scenes in range) comparison            
            // Enable linking on drop zone behaviour
          }
        }
      }

      // all nodes start separated
      // the scene used to drag first is first in the list
      // the next one appended is the second in the order, and so on
    })); // end of drag
  }

  update(time, delta) {
    // Update the link line's position if currently visible
    // if(this.scene.linkLine.visible) {
    //   this.updateLinkLinePos(x1, y1, x2, y2)
    // }
  }
}