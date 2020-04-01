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
    // Whether to exit the scene parameter dialog or not (temporary)
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
    // Spawn the greeter dialog box to introduce the game
    this.createTextBox(this, 100, 100, {
      wrapWidth: 700,
      fixedWidth: 750,
      fixedHeight: 100,
    }).start(greeterContent, 50);

    // Level 1

    // Add the other scenes/moments    
    this.createMoment('CriticalHit', CriticalHit);
    //this.createMoment('GoodNPCPunchLine', GoodNPCPunchLine);
    this.createMoment('RareLoot', RareLoot);

    // Scene population test 1   
    // this.createMoment('CriticalHit2', CriticalHit);
    // this.createMoment('GoodNPCPunchLine2', GoodNPCPunchLine);
    // this.createMoment('RareLoot2', RareLoot);
    // // // Scene population test 2 
    // this.createMoment('CriticalHit3', CriticalHit);
    // this.createMoment('GoodNPCPunchLine3', GoodNPCPunchLine);
    // this.createMoment('RareLoot3', RareLoot);
    // this.createMoment('RareLoot4', RareLoot);

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
    // Make it invisible until connections start being made between scenes
    this.setLinkLineVisible(false);
    // Setup background graphics
    this.setupBackgroundGraphics();
  }

  // Mr. Rex Rainbow
  createTextBox(scene, x, y, config) {
    const GetValue = Phaser.Utils.Objects.GetValue;
    let wrapWidth = GetValue(config, 'wrapWidth', 0);
    let fixedWidth = GetValue(config, 'fixedWidth', 0);
    let fixedHeight = GetValue(config, 'fixedHeight', 0);
    let textBox = scene.rexUI.add.textBox({
        x: x,
        y: y,
        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_DARK)
          .setStrokeStyle(2, COLOR_LIGHT),
        text: scene.getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight),
        action: scene.add.image(0, 0, 'nextPage').setTint(COLOR_LIGHT).setVisible(false),
        space: {
          left: 20,
          right: 20,
          top: 20,
          bottom: 20,
          icon: 10,
          text: 10,
        }
      })
      .setOrigin(0)
      .layout();
    textBox
      .setInteractive()
      .on('pointerdown', function () {
        let icon = this.getElement('action').setVisible(false);
        this.resetChildVisibleState(icon);
        if (this.isTyping) {
          this.stop(true);
        } else {
          this.typeNextPage();
        }
      }, textBox)
      .on('pageend', function () {
        if (this.isLastPage) {
          return;
        }
        let icon = this.getElement('action').setVisible(true);
        this.resetChildVisibleState(icon);
        icon.y -= 30;
        let tween = scene.tweens.add({
          targets: icon,
          y: '+=30',
          ease: 'Bounce',
          duration: 500,
          repeat: 0,
          yoyo: false
        });
      }, textBox);
    return textBox;
  }
  // Mr. Rex Rainbow
  getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight) {
    return scene.add.text(0, 0, '', {
        fontSize: '20px',
        wordWrap: {
          width: wrapWidth
        },
        maxLines: 3
      })
      .setFixedSize(fixedWidth, fixedHeight);
  }
  // Mr. Rex Rainbow
  getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight) {
    return scene.rexUI.add.BBCodeText(0, 0, '', {
      fixedWidth: fixedWidth,
      fixedHeight: fixedHeight,

      fontSize: '20px',
      wrap: {
        mode: 'word',
        width: wrapWidth
      },
      maxLines: 3
    })
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
      this.popSequencerDataWindow(scene, pointer);
    }, this.scene);
  }

  // Pop up the sequencer data window, gets the scene's data and uses it to 
  // Display what sliders/options will be tweakble by the user
  popSequencerDataWindow(scene, pointer) {
    // Using closure to benefit from getting the scene parameter
    const readSceneData = (button) => {
      console.log(button.text);
      // Access the scene parameter passed and do things to change the scene's parameters
      this.handleChoices(button, scene);
    }
    // Handle whether to spawn the dialog or not
    return this.handleDialogSpawn(pointer, readSceneData, scene);
  }

  handleDialogSpawn(pointer, readSceneData, scene) {
    const OFFSET = 350;
    if (dialog === undefined) {
      console.debug(pointer);
      dialog = this.createDialog(this, pointer.x + OFFSET, pointer.y, readSceneData, scene);
    } else if (!dialog.isInTouching(pointer)) {
      try {
        dialog.destroy();
        dialog = undefined;
      } catch (err) {
        console.debug(err.message);
      } finally {
        console.debug("Returning anyways");
        return;
      }
    }
  }

  handleChoices(button, scene) {
    if (button.text === "Text") {
      console.debug("changing representation of scene");
      // TODO make user select this / change this...
      let newText = "CHANGED THIS SCENE'S TEXT.";
      scene.sequencingData.representation.text = newText;
    } else if (button.text === "Sound") {
      if (scene.sceneTextRepresentation) {
        // Read the scene as speak
        this.handleResponsiveVoice(scene);
      }
    } else if (button.text === "Image") {
      //TODO        
    } else if (button.text === "Game") {
      //TODO
    } else if (button.text === "Ephemeral") {
      //TODO
      this.handleEphemeral(scene);
    } else if (button.text === "Confirm") {
      dialog.destroy();
    } else if (button.text === "Exit") {
      dialog.destroy();
    }
  }

  handleResponsiveVoice(scene) {
    let textToSound = scene.sceneTextRepresentation.text;
    let sceneToVoice = responsiveVoice.speak(textToSound, "UK English Male", soundOptions);
    // Store it in the scene
    scene.sequencingData.representation.sound = sceneToVoice;
  }

  handleEphemeral(scene) {
    const TIME_TILL_GONE = 3;
    let visibility = false;
    setInterval(() => {
      this.time.delayedCall(TIME_TILL_GONE + 2, () => {
        visibility = !visibility;
        scene.scene.setVisible(visibility);
      }, [], this.scene);
    }, TIME_TILL_GONE);
    scene.sequencingData.representation.ephemeral = true;
  }

  // From Mr. Rex Rainbow (MIT license)
  createDialog(sceneToSpawn, x, y, onClick, sceneClicked) {

    let createLabel = this.createLabel;
    let dialog = sceneToSpawn.rexUI.add.dialog({
        x: x,
        y: y,
        width: 250,
        background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, COLOR_PRIMARY),
        title: createLabel(this, 'Moment Parameters').setDraggable(),
        content: createLabel(this, 'Choose a Representation'),
        description: createLabel(this, sceneClicked.parent.name),
        choices: [
          createLabel(this, 'Text'),
          createLabel(this, 'Sound'),
          createLabel(this, 'Image'),
          createLabel(this, 'Game'),
          createLabel(this, 'Ephemeral')
        ],
        actions: [
          createLabel(this, 'Confirm'),
          createLabel(this, 'Exit')
        ],
        space: {
          left: 20,
          right: 20,
          top: -20,
          bottom: -20,

          title: 25,
          titleLeft: 30,
          content: 25,
          description: 25,
          descriptionLeft: 20,
          descriptionRight: 20,
          choices: 25,

          toolbarItem: 5,
          choice: 15,
          action: 15,
        },
        expand: {
          title: false,
          // content: false,
          // description: false,
          // choices: false,
          // actions: true,
        },
        align: {
          title: 'center',
          actions: 'right',
        },
        click: {
          mode: 'release'
        }
      }).setDraggable('background')
      .layout()
      .popUp(1000);

    // Tweening it
    let tween = this.tweens.add({
      targets: dialog,
      scaleX: 1,
      scaleY: 1,
      ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
      duration: 1000,
      repeat: 0, // -1: infinity
      yoyo: false
    });
    // Event handler for clicking items in the dialog
    dialog.on('button.click', (button, groupName, index, pointer, event) => {
      onClick(button);
    }, this);
    dialog.on('button.over', (button, groupName, index) => {
      button.getElement('background').setStrokeStyle(1, 0xffffff);
    }, this);
    dialog.on('button.out', (button, groupName, index) => {
      button.getElement('background').setStrokeStyle();
    }, this);
    return dialog;
  }

  createLabel(scene, text) {
    return scene.rexUI.add.label({
      width: 40,
      height: 40,
      background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, COLOR_DARK),
      text: scene.add.text(0, 0, text, {
        fontSize: '24px'
      }),
      space: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      }
    });
  }

  //handleDrag(draggableZoneParent, momentInstance)
  //@args: draggableZoneParent {GameObject.Zone}, momentInstance {Phaser.Scene}
  //handle dragging behaviour event on each momentInstance created, by using the draggableZoneParent gameObject
  handleDrag(draggableZoneParent, momentInstance) {
    this.input.enableDebug(draggableZoneParent);
    draggableZoneParent.on('drag', (function (pointer, dragX, dragY) {
      if (!this.sceneParameterOpen) {
        // Cache the currentlyDraggedScene for events handling such as Create Link
        this.scene.setCurrentlyDraggedScene(this);
        // 1. Work on Single Responsibility principle: Update display and underlying connection behaviour only
        this.scene.updateDragZone(draggableZoneParent, dragX, dragY, momentInstance);
        // 2. A separate object to query the connections object on this particular drag zone instance
        this.scene.querySceneConnectionManager(this);
      }
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
let dialog;
const COLOR_PRIMARY = 0xA9A9A9;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;
let soundOptions = {
  "rate": Math.random(),
  "pitch": Math.random()
}

let greeterContent = `Tutorial: You are in the curating room.
Her Grace, the Horizon Princess XIV--blessed be her sacred name, and long live her rule--wishes to impart her wise words to you.\nThe Horizon Princess: Gyaarg! Did you expect some weak frill in a dress? Hah! Sorry to disappoint. So you're the new recruit? Well, we'll see how long you last.
Listen up closely, rookie. By clicking on one of these circle-looking things, you can choose how to represent its meaning.
Drag one of these moments next to another one and link them by pressing the 'Create Link' button on the bottom right of the screen.
All the paired moments will be put together in the Sequencing Room. Then you'll have to deal with your choices. 
Got it? That's how you do it. Go ahead now and try it.`;

let questOneNarrationContent = `I have a quest for you. Seriously. The dungeons
leading to my personal library were raided. My guards have forgotten 
what the brigands looked like and even locked themselves down there accidently! 
Please find a way to break the door open.`;

let progressNotification = `You earned your loot! The horizon princess's library is expanding.`;