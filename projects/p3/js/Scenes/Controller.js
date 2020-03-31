// This scene would be reduced to handling systems around each individual scene
// in the Curating-Room, also handling the MomentFactory
// I.e., Each scene in the curating-room would have their own MomentConnectionManager
// LinkManager
class Controller extends Phaser.Scene {
  constructor() {
    super({
      key: 'Controller'
    });
    // The currently dragged scene by the user
    this.currentlyDraggedScene = null;
    // The currently dragged scene's closest neighbour
    this.currentlyDraggedSceneNeighbour = null;
    // The reference to the created link button at the bottom right
    this.createdLinkButton = null;
    // If a create link button was already created
    this.createdLinkButtonAlready = false;
    // The available connections to a currently dragged scene (criteria: in range and not linked already)
    this.availableConnections = false;
    // The linked list array updated from each scene that is in a linked state. Used for the sequencer
    this.linkedScenesList = [];
    // Whether to exit the scene parameter menu or not (temporary)
    this.sceneParameterOpen = false;
  }

  init() {
    // Scenes' determined width and height
    this.momentWidth = 150;
    this.momentHeight = 150;
  }

  preload() {
    this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
    this.valueBarTrack = this.load.image("valueBarTrack", "./assets/images/ui/valueBarTrack.psd");
    this.valueBarImg = this.load.image("valueBarImg", "./assets/images/ui/valueBar.psd");
  }

  create() {
    // Add the other scenes/moments    
    this.createMoment('CriticalHit', CriticalHit);
    this.createMoment('GoodNPCPunchLine', GoodNPCPunchLine);
    this.createMoment('RareLoot', RareLoot);
    // Scene population test 1   
    this.createMoment('CriticalHit2', CriticalHit);
    this.createMoment('GoodNPCPunchLine2', GoodNPCPunchLine);
    this.createMoment('RareLoot2', RareLoot);
    // // Scene population test 2 
    this.createMoment('CriticalHit3', CriticalHit);
    this.createMoment('GoodNPCPunchLine3', GoodNPCPunchLine);
    this.createMoment('RareLoot3', RareLoot);

    this.createMoment('RareLoot4', RareLoot);

    // Create the main canvas that will display optimizing behaviours of systems in the back or interactively display stats
    this.createMainCanvas(true);
    // The array of draggable zones that are active
    this.draggableZonesActive = [];

    // Cache only the Zones gameObjects that are active
    for (const element of this.children.list) {
      if (element.type === 'Zone' && element.active) {
        this.draggableZonesActive.push(element);
      }
    }
    // Spawn a contextual button for linking scenes only if there are snapped scenes
    // And if and only if at drag end to prevent multiple buttons
    this.input.on('dragend', this.spawnContextualButton);
    // Create the line used for linking scenes
    this.linkLine = this.createLinkLine(this.momentWidth, this.momentHeight, 0, 0, 100, 100, 0xFFFFFF, 5, true);

    // Setup background graphics
    this.setupBackgroundGraphics();
  }

  // Raining/Snowing passive moments in the background -- may be cybernetics-like system optimizing factors in polish phase of project
  setupBackgroundGraphics() {
    backgroundScenes = this.add.graphics();
    const backgroundSceneAmount = 15;
    // Random sized circles
    shapes = new Array(backgroundSceneAmount).fill(null).map(function (nul, i) {
      return new Phaser.Geom.Circle(Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 600), Phaser.Math.Between(25, 75));
    });
    // Rect area corresponding to the main camera
    rect = Phaser.Geom.Rectangle.Clone(this.cameras.main);
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
    const width = this.scale.width;
    const height = this.scale.height;
    const offset = 150;
    let x = Phaser.Math.Between(offset, width - this.momentWidth * 2);
    let y = Phaser.Math.Between(offset, height - this.momentHeight * 2);

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
    // Handle drag related events on this zone
    this.handleDrag(draggableZoneParent, momentInstance);
    // Handle click related on this zone (sequencer data window)
    this.handleClick(draggableZoneParent, momentInstance);
    // Set a name for the zone (used for handling it later)
    draggableZoneParent.setName(key);
    this.scene.add(key, momentInstance, true);
  }

  // Handle click on the zone that will pop up the sequencer data window
  handleClick(draggableZoneParent, scene) {
    draggableZoneParent.on('pointerdown', (pointer) => {
      //On click, spawn the sequencer data window
      //Check if there's no window already popped up
      this.popSequencerDataWindow(scene, pointer);
    }, this.scene);
  }

  // Pop up the sequencer data window, gets the scene's data and uses it to 
  // Display what sliders/options will be tweakble by the user
  popSequencerDataWindow(scene, pointer) {
    const MENU_SPAWN_OFFSET = 85;
    const readSceneData = (button) => {
      console.log(button.text);
      // Access the scene parameter passed and
      // Do things to change the scene's parameters
      if (button.text === "text") {
        console.debug("changing representation of scene");
        // TODO make user select this / change this...
        let newText = "CRITICAL HIT! LIMIT BREAK! OVERHIT! OVER 9K!";
        scene.sequencingData.representation.text = newText;
      } else if (button.text === "sound") {
  
      } else if (button.text === "image") {
  
      } else if (button.text === "game") {
  
      } else if (button.text === "sound") {
  
      } else if (button.text === "ephemeral") {
  
      }
    }  

    // Access the sequencer data window inside the scene
    if (menu === undefined) {
      console.debug(pointer);
      menu = this.createMenu(this, pointer.x + MENU_SPAWN_OFFSET, pointer.y + MENU_SPAWN_OFFSET, sceneMenuParameters, readSceneData);
    } else if (!menu.isInTouching(pointer)) {
      menu.collapse();
      menu = undefined;
    }
  }

  // From Mr. Rex Rainbow (MIT license)
  createMenu(scene, x, y, items, onClick) {
    let menu = scene.rexUI.add.menu({
      x: x,
      y: y,

      items: items,
      createButtonCallback: (item, i) => {
        return scene.rexUI.add.label({
          background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0, COLOR_PRIMARY),
          text: scene.add.text(0, 0, item.name, {
            fontSize: '20px'
          }),
          icon: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_DARK),
          space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
            icon: 10
          }
        })
      },

      easeIn: {
        duration: 500,
        orientation: 'y'
      },

      easeOut: {
        duration: 100,
        orientation: 'y'
      },
    });

    menu
      .on('button.over', (button) => {
        button.getElement('background').setStrokeStyle(1, 0xffffff);
      })
      .on('button.out', (button) => {
        button.getElement('background').setStrokeStyle();
      })
      .on('button.click', (button) => {
        onClick(button);
      })
    return menu;
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
    closestNeighbour = seekNeighbourMoment.operation();

    // If closest neighbour is already linked / paired to another scene, return
    if (closestNeighbour.getData('moment').momentFSM.stateArray['LinkedState'].isLinked) {
      return;
    }
    // Cache the closest neighbour and available connections found for event handling
    this.setCurrentlyDraggedSceneNeighbour(closestNeighbour);
    this.setAvailableConnections(dragHandler.getData('moment').momentConnectionManager.checkForAvailableConnections(dragHandler, closestNeighbour));

    // At this point, neighbour scenes in range can be snapped (and then) become locked together -- in this state, a link can be created (listened to) by the user or de-snapped when out of range
    this.handleSnapping(dragHandler);
  }

  handleSnapping(dragHandler) {
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

  //TODO cache a ref to a link go that will be kept inside the linked state, call this from there
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
    this.createdLinkButton = this.add.circle(width - offset, height - offset, 150, '#F5F5DC').setInteractive().on('pointerdown', () => {
      createLinkEmitter.emit('createLink', 'LinkedState', context);
    });
    console.debug('Created link bt');
  }

  resetCurrentlyDragged() {
    this.setCurrentlyDraggedScene(null);
    this.setCurrentlyDraggedSceneNeighbour(null);
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
    // Pair consequences with actions -> Moments of reflection, anti-linear narrative?

  }

  parametrizeLinkedScenes() {
    // TODO
    // 
    // Parameters:
    // 
  }

  shuffleNewScenes() {
    // TODO
  }

  update(time, delta) {
    // Update shapes' position
    shapes.forEach(function (shape, i) {
      shape.x += (1 + 0.1 * i);
      shape.y += (1 + 0.1 * i);
    });
    // Wrap these background shapes in a rect area corresponding to the controller's camera
    Phaser.Actions.WrapInRectangle(shapes, rect, 72);
    // Draw the shapes
    this.draw();
  }

  // Draw passive moments in the background
  draw() {
    backgroundScenes.clear();
    shapes.forEach(function (shape, i) {
      backgroundScenes
        .fillStyle((i) => {
          // Black/gray circles
          return 0x000000;
        }, 0.5)
        .fillCircleShape(shape);
    });
  }

  spawnContextualButton() {
    if (this.scene.getAvailableConnections() === true) {
      // Don't recreate a button if there's already one
      if (this.scene.createdLinkButtonAlready) {
        return;
      }
      // Create the context for creating a link scenes button bottom right
      let context = [this.scene.getCurrentlyDraggedScene(), this.scene.getCurrentlyDraggedScene().getData('moment'), this.scene.getClosestNeighbour()];
      let linkButton = this.scene.createLinkButton(context);
      // Reset
      this.scene.setAvailableConnections(false);
    }
  }
}
// Global variables (for now)
let closestNeighbour;
let createLinkEmitter = new Phaser.Events.EventEmitter();
let backgroundScenes;
let shapes;
let rect;
let menu;
// UI for scene parameters
let sceneMenuParameters = [{
    name: "representation",
    children: [{
        name: "text"
      },
      {
        name: "sound"
      },
      {
        name: "image"
      },
      {
        name: "game"
      }
    ]
  },
  {
    name: "ephemeral",
    children: [{
        name: "yes"
      },
      {
        name: "no"
      }
    ]
  }
];
const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;