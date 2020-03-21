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
    this.createLinkLine(momentWidth, momentHeight, 0, 0, 100, 100, 0xFFFFFF, 5, true);
    this.setLinkLineVisible(false);
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
    // Set some data for this go, namely the number of connections it has and which connections these are
    draggableZoneParent.setData( { maxActiveConnections: 3, activeConnections: 0, firstConnection: null, secondConnection: null });
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
      let closestNeighbour = this.scene.findClosestNeighbour(this);
      // Sets the visual link visible if in range
      const rangeToLink = 500;
      if(Math.abs( this.getCenter().distance( closestNeighbour.getCenter() ) ) <= rangeToLink) {
        let updateDataAndActiveConnections = true;
        // If this go already has a connection to closestNeighbour, we don't want to re-create new connections with it
        if(this.getData('firstConnection') === closestNeighbour || this.getData('secondConnection') === closestNeighbour) {
          updateDataAndActiveConnections = false;
        }       
        // Display logic
        this.scene.setLinkLineVisible(true);
        this.scene.updateLinkLinePos(this.x, this.y, closestNeighbour.x, closestNeighbour.y);
        // Data logic
        if(updateDataAndActiveConnections) {
          // Update this go's first and second connections
          // If this go already has a first connected scene, then add closestNeighbour as the second connection
          if(this.getData('firstConnection') !== null) {
            this.setData('secondConnection', closestNeighbour);
          }
          else {
            this.setData('firstConnection', closestNeighbour);
          }
          // Update the closestNeighbour's own first and second connections
          if(closestNeighbour.getData('firstConnection') !== null) {
            closestNeighbour.setData('secondConnection', this);
          }
          else {
            closestNeighbour.setData('firstConnection', this);
          }
          console.debug("Closest neighbour's own first connection: " + closestNeighbour.getData('firstConnection').name);
          console.debug("Closest neighbour's own second connection: " + closestNeighbour.getData('secondConnection').name);
          // Update the number of active connections this go currently has, if not over limit
          this.scene.updateActiveConnections(this, true);
        }
      }
      else {
        // Display logic
        this.scene.setLinkLineVisible(false);
        // Data logic - Temporary, currently this doesn't take into account when you separate a scene from only one neighbour (the one that became too far too link with)     
        // TODO Need to flush the farthest neigbour from go's scene connections data if it has more than one active connections already
        this.setData('firstConnection', null);
        this.setData('secondConnection', null);
        this.scene.updateActiveConnections(this, false);        
      }
      // Snap first two closest scenes joined together
      const maxSnap = 3;
      // Need to know, upon draggging a go, how many active current connection it already has
      let currentlySnapped = this.getData('activeConnections');
      console.log("Currently snapped with this go: " + currentlySnapped);
    }));
  }

  //findClosestNeighbour(gameObject)
  //@args: gameObject
  //Find this dragged scene's closest neighbour, excluding self, by comparing distances from the center of the scene. Returns the closest go
  findClosestNeighbour(gameObject) {
    // 1. Find out which scenes to compare with other than self
    let otherScenes = this.draggableZonesActive.filter( (go) => {
      return go != gameObject;
    });
    //console.log("Other scenes: " + otherScenes[0].name + ", " + otherScenes[1].name);

    // 2. Find closest distance from self to these scenes, by iterative approximation
    let indexClosest = 0; // First hypothesis
    for(let i = 0; i < otherScenes.length; i++) {
      if(Math.abs(gameObject.getCenter().distance( otherScenes[i].getCenter())) 
        < Math.abs(gameObject.getCenter().distance(otherScenes[indexClosest].getCenter())) ) 
      {
        indexClosest = i;
      }
    }
    //console.log("Closest neighbour: " + otherScenes[indexClosest].name);
    return otherScenes[indexClosest];
  }

  updateActiveConnections(gameObject, add) {
    console.debug("Updating connections");
    if(add) { // Add connection
      if(gameObject.getData('activeConnections') < gameObject.getData('maxActiveConnections')) {
        let activeConnections = gameObject.getData('activeConnections');
        console.debug("Old number of active connections: " + gameObject.getData('activeConnections'));
        gameObject.setData('activeConnections', ++activeConnections);
        console.debug("New number of active connections: " + gameObject.getData('activeConnections'));
      }  
    }
    else { // Remove connection
      if(gameObject.getData('activeConnections') > 0) {
        let activeConnections = gameObject.getData('activeConnections');
        console.debug("Old number of active connections: " + gameObject.getData('activeConnections'));
        gameObject.setData('activeConnections', --activeConnections);
        console.debug("New number of active connections: " + gameObject.getData('activeConnections'));
      }  
    }
  }

  update(time, delta) {

  }
}