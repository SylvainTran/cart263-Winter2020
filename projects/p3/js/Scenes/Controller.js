// This scene would be reduced to handling systems around each individual scene
// in the Curating-Room, also handling the MomentFactory
// I.e., Each scene in the curating-room would have their own MomentConnectionManager
// LinkManager
class Controller extends Phaser.Scene {
  constructor() {
    super({
      key: 'Controller'
    });
    this.currentlyDraggedScene = null;
    this.currentlyDraggedSceneNeighbour = null;
    this.createdLinkButton = null;
    this.createdLinkButtonAlready = false;
    this.availableConnections = false;
  }

  init() {
    this.momentWidth = 150;
    this.momentHeight = 150;
  }

  preload() {

  }

  create() {
    // Add the other scenes/moments    
    this.createMoment('CriticalHit', CriticalHit);
    this.createMoment('GoodNPCPunchLine', GoodNPCPunchLine);
    this.createMoment('RareLoot', RareLoot);
    // Scene population test 1   
    // this.createMoment('CriticalHit2', CriticalHit);
    // this.createMoment('GoodNPCPunchLine2', GoodNPCPunchLine);
    // this.createMoment('RareLoot2', RareLoot);
    // // Scene population test 2 
    // this.createMoment('CriticalHit3', CriticalHit);
    // this.createMoment('GoodNPCPunchLine3', GoodNPCPunchLine);
    // this.createMoment('RareLoot3', RareLoot);

    // Create the main canvas that will display optimizing behaviours of systems in the back or interactively display stats
    this.createMainCanvas(true);
    this.draggableZonesActive = [];
    // cache only the Zones gameObjects that are active <- for now
    for (const element of this.children.list) {
      if (element.type === 'Zone' && element.active) {
        this.draggableZonesActive.push(element);
      }
    }
    // Create the line used for linking scenes
    this.linkLine = this.createLinkLine(this.momentWidth, this.momentHeight, 0, 0, 100, 100, 0xFFFFFF, 5, true);
  }

  createMainCanvas(addToActiveDisplay) {
    this.World = new World('World');
    this.scene.add('World', this.World, addToActiveDisplay);
    console.log("Added main canvas world.");
  }

  //createMoment(key, moment)
  //@args: key {string}, moment {Phaser.Scene}
  //creates moment using the key and moment parameters
  createMoment(key, moment) {
    const leftMargin = 100;
    const topMargin = 100;
    // TODO fix not spawning inside inner margins. Create a random range to spawn the game moments in the main canvas
    let x = Phaser.Math.Between(leftMargin, window.innerWidth);
    let y = Phaser.Math.Between(topMargin, window.innerHeight);

    // Create a parent zone for touch and dragging the scene
    let draggableZoneParent = this.add.zone(x, y, moment.WIDTH, moment.HEIGHT).setInteractive({
      draggable: true
    }).setOrigin(0);
    // Create the instance and setup the drag handling
    let momentInstance = new moment(key, draggableZoneParent);
    // Set some data for this parent zone, namely its moment scene, the number of connections it has and which connections these are
    draggableZoneParent.setData({
      moment: momentInstance,
      maxActiveConnections: 3,
      activeConnections: 0,
      firstConnection: null,
      secondConnection: null
    });
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
      // Cache the currentlyDraggedScene for events handling such as Create Link
      this.scene.setCurrentlyDraggedScene(this);
      // 1. Work on Single Responsibility principle: Update display and underlying connection behaviour only
      this.scene.updateDragZone(draggableZoneParent, dragX, dragY, momentInstance);
      // 2. A separate object to query the connections object on this particular drag zone instance
      this.scene.querySceneConnectionManager(this);
    }));
  }

  querySceneConnectionManager(dragHandler) {
    // Find nearest moment scene from this gameObject being dragged along, using a Strategy pattern for flexibility
    const seekNeighbourMoment = new Context(new FindClosestNeighbour(dragHandler, this.draggableZonesActive));
    // TODO encapsulate this
    closestNeighbour = seekNeighbourMoment.operation();
    // Cache it for event handling
    this.setCurrentlyDraggedSceneNeighbour(closestNeighbour);
    this.setAvailableConnections(dragHandler.getData('moment').momentConnectionManager.checkForAvailableConnections(dragHandler, closestNeighbour));
    // At this point, neighbour scenes in range can be snapped (and then) become locked together -- in this state, a link can be created (listened to) by the user or de-snapped when out of range
    if (this.availableConnections) {
      dragHandler.getData('moment').momentConnectionManager.snapAvailableNeighbours(dragHandler, closestNeighbour);
      // Todo find a better place to call/render the link line
      this.displayLink(dragHandler, closestNeighbour, true);
    } else {
      this.displayLink(dragHandler, closestNeighbour, false);
    }
  }

  updateDragZone(draggableZoneParent, dragX, dragY, momentInstance) {
    draggableZoneParent.setPosition(dragX, dragY);
    momentInstance.refresh();
  }

  createLinkLine(x, y, x1, y1, x2, y2, color, width, visible) {
    this.scene.linkLine = this.add.line(x, y, x1, y1, x2, y2, color, visible).setOrigin(0)
      .setLineWidth(width);
  }

  setLinkLineVisible(visibility) {
    this.scene.linkLine.setVisible(visibility);
  }

  displayLink(dragHandler, closestNeighbour, visible) {
    this.setLinkLineVisible(visible);
    this.updateLinkLinePos(dragHandler.x, dragHandler.y, closestNeighbour.x, closestNeighbour.y);
  }

  updateLinkLinePos(x1, y1, x2, y2) {
    this.scene.linkLine.setTo(x1, y1, x2, y2);
  }

  // TODO disable emitter in Snapped state once this is used, or remove thsi button with its emit altogether
  createLinkButton(context) {
    this.createdLinkButtonAlready = true;
    // 1. Adding a listener to the leaveSnapState method in the SnappedState.js 
    // composed in every scene
    const width = this.scale.width;
    const height = this.scale.height;
    const offset = 150; 
    console.log(width);
    this.createdLinkButton = this.add.circle(width - offset, height - offset, 150, '#F5F5DC').setInteractive().on('pointerdown', () => {
      createLinkEmitter.emit('createLink', 'LinkedState', context);
    });
    console.debug('Created link bt');
  }

  getClosestNeighbour() {
    return this.currentlyDraggedSceneNeighbour;
  }

  getCurrentlyDraggedScene() {
    return this.currentlyDraggedScene;
  }

  getAvailableConnections() {
    return this.availableConnections;
  }

  getCreateLinkButton() {
    return this.createdLinkButton;
  }

  setCurrentlyDraggedScene(scene) {
    this.currentlyDraggedScene = scene;
  }

  setCurrentlyDraggedSceneNeighbour(neighbour) {
    this.currentlyDraggedSceneNeighbour = neighbour;
  }

  setAvailableConnections(value) {
    this.availableConnections = value;
  }

  lockSnappedScenes() {
    // TODO
  }

  sequenceLinkedScenes() {
    // TODO
  }

  parametrizeLinkedScenes() {
    // TODO
  }

  shuffleNewScenes() {
    // TODO
  }

  update(time, delta) {
    // Spawn a context button for linking scenes only if there are snapped scenes
    if (this.getAvailableConnections() == true) {
      if (this.createdLinkButtonAlready) {
        return;
      }
      // Create the context for creating a link scenes button bottom right
      let context = [this.getCurrentlyDraggedScene(), this.getClosestNeighbour()];
      let linkButton = this.createLinkButton(context);
    }
  }
}
// Global variables (for now)
let closestNeighbour;
let createLinkEmitter = new Phaser.Events.EventEmitter();