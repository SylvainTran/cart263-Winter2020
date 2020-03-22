// This scene would be reduced to handling systems around each individual scene
// in the Curating-Room, also handling the MomentFactory
// I.e., Each scene in the curating-room would have their own MomentConnectionManager
// LinkManager
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
    // Create the instance and setup the drag handling
    let momentInstance = new moment(key, draggableZoneParent);
    // Set some data for this parent zone, namely its moment scene, the number of connections it has and which connections these are
    draggableZoneParent.setData( { moment: momentInstance, maxActiveConnections: 3, activeConnections: 0, firstConnection: null, secondConnection: null });
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
      // 1. Work on Single Responsibility principle: Update drag zone pos and display only
      this.scene.updateDragZone(draggableZoneParent, dragX, dragY, momentInstance);
      // 2. A separate object to query the connections object on this particular drag zone instance
      this.scene.querySceneConnectionManager(this);
    }));
  }
  
  querySceneConnectionManager(go) {
    // Find nearest zone from this gameObject being dragged
    let closestNeighbour = this.findClosestNeighbour(go);
    // Sets the visual link visible if in range
    const rangeToLink = 500;
    // TODO Only check for neighbours if you're in range of having one -- does this pre-reaction good to have?
    // TODO Distance check + and IF and only IF user presses Create Link, update connections then
    if (this.checkDistance(go, closestNeighbour, rangeToLink)) {
      updateDataAndActiveConnections = true;
      // If this go already has a connection to closestNeighbour, we don't want to re-create new connections with it
      if (this.orderConnections(go, closestNeighbour)) {
        updateDataAndActiveConnections = false;
      }
      // Display logic
      this.displayLink(go, closestNeighbour, true);
      // User interaction logic
      // If player clicks on the 'Create Link' contextual button while the current game state is two linked moments on
      // Snap the current dragged go and its closest neighbour together
      // Linking them and locking to prevent finding another neighbour while locked
      // Data logic
      if (updateDataAndActiveConnections) {
        console.debug("Current link state: " + updateDataAndActiveConnections);
        // Update this go's first and second connections
        this.updateConnections(go, closestNeighbour);
        console.debug("Closest neighbour's own first connection: " + closestNeighbour.getData('firstConnection').name);
        //console.debug("Closest neighbour's own second connection: " + closestNeighbour.getData('secondConnection').name);
        // Update the number of active connections this go currently has, if not over limit
        // TODO and IF and only IF user presses Create Link
        this.updateActiveConnections(go, true);
      }
    }
    else {
      // Display logic
      this.setLinkLineVisible(false);
      // Data logic - Temporary, currently this doesn't take into account when you separate a scene from only one neighbour (the one that became too far too link with)     
      // TODO Need to flush the farthest neigbour from go's scene connections data if it has more than one active connections already
      go.setData('firstConnection', null);
      go.setData('secondConnection', null);
      this.updateActiveConnections(go, false);
    }
    // Snap first two closest scenes joined together
    const maxSnap = 3;
    // Need to know, upon draggging a go, how many active current connection it already has
    let currentlySnapped = go.getData('activeConnections');
    console.log("Currently snapped with this go: " + currentlySnapped);
  }

  displayLink(go, closestNeighbour, visible) {
    this.setLinkLineVisible(visible);
    this.updateLinkLinePos(go.x, go.y, closestNeighbour.x, closestNeighbour.y);
  }

  updateDragZone(draggableZoneParent, dragX, dragY, momentInstance) {
    draggableZoneParent.setPosition(dragX, dragY);
    momentInstance.refresh();
  }

  update(time, delta) {
    // Add listener to context button for updateDataAndActiveConnections to be true checked on click
    // if this.scene.updateDataAndActiveConnections is true
    // change the contextual primary action button to show that linking is possible
    // enable 
  }
}