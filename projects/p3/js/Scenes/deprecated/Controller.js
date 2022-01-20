// Controller
//
// Handles object relationships. This script was sort of abandoned
// Around April 16th 2020 in favor of using a starting to use mostly a 
// single script, World.js. It still contains game mechanics for dragging
// and scene manipulation that was started to be deported into GAMEOBJECT
// manipulation instead of scene, for logistical issues. 
// Some top level comments may be missing due to this being put aside for the moment.
class Controller extends Phaser.Scene {
  constructor() {
    super('Controller');
    // The World scene containing the outer most world
    this.World = null;
    // The currently dragged scene by the user
    this.currentlyDraggedScene = null;
    // The currently dragged scene's closest neighbour
    this.currentlyDraggedSceneNeighbour = null;
    // If there are available scenes to connect based on range to link with a closest neighbour
    this.availableConnections = null; 
    // The reference to the created link button at the bottom right
    this.createdLinkButton = null;
    // If a create link button was already created
    this.createdLinkButtonAlready = false;
    // The linked list array updated from each scene that is in a linked state. Used for the sequencer
    this.linkedScenesList = [];
    // Whether to exit the scene parameter dialog or not (temporary)
    this.sceneParameterOpen = false;
    // Current level of the game at and its previous one for checking if it changed
    this.previousArea = 0;
    this.currentArea = 0;
    // level config
    this.areaConfig = null;
    // Level's moment references (for later scene destruction)
    this.actorsInLevel = [];
    // Draggable zones in use in this level
    this.draggableZonesActive = [];
    // Number of paired scenes
    this.numberOfPairedScenes = 0;
    // Player in the global world (first layer of reality) in controller.js/world.js
    this.globalPlayer = null;
    // Player lock in a scene (only one incepted player at a time allowed)
    this.scenePlayerLock = false;
    // Music and UI sounds
    this.uiPoingSound = null;
    this.linkButtonSound = null;
    this.sceneEnterSound = null;
    this.pianoTheme = null;
    // Player sounds
    this.playerCreatedSound = null;
    // Footstep sounds (Different per scene)
    this.footstepSound = null;
    // Dialog box currently used by the UI
    this.dialog = undefined;
  }

  // init
  //
  // Inits scenes in parallel (ui, hud, world)
  // Also gets a reference to the world and setups w x l for scenes
  init() {
    // Get the World (global scene) instance
    this.World = this.scene.manager.getScene('World');
    // Scenes' determined width and height
    this.momentWidth = 50;
    this.momentHeight = 50;
    // Launch these scenes in parallel to this one  
    this.scene.launch('UI');        
    this.scene.launch('Hud');       
  }

  // create
  //
  // Also gets a reference to the world and setups w x l for scenes
  // The themes are being played from here
  create() {
    // Player sounds
    this.playerCreatedSound = this.sound.add('zap');
    // Set-up an event handler
    createLinkEmitter.on('createLink', this.handleLinking, this);
    // Spawn a contextual button for linking scenes only if there are snapped scenes
    // And if and only if at drag end to prevent multiple buttons
    this.World.input.on('dragend', this.spawnContextualButton);
    // Create the line used for linking scenes
    this.linkLine = this.createLinkLine(this.momentWidth, this.momentHeight, 0, 0, 100, 100, 0x000000, 5, true);
    // Make it invisible until connections start being made between scenes
    this.setLinkLineVisible(false);
    // Setup background graphics
    this.setupBackgroundGraphics();
    // Sounds
    this.uiPoingSound = this.sound.add('ui-poing');
    this.linkButtonSound = this.sound.add('linkButton');
    this.sceneEnterSound = this.sound.add('sceneEnter');
    this.pianoTheme = this.sound.add('pianoTheme');
    this.mainTheme = this.sound.add('mainTheme');
    // this.mainTheme.play();    
    // this.mainTheme.setLoop(true);
    // Footstep sounds
    this.footstepSound = this.sound.add('footstepDirt');
  }

  // adjustRotation
  //
  // Adjusts in-scene rotation to be aligned to the angle of the closestNeighbour's own scene text display
  adjustRotation(self, neighbour) {
    // If there is an available closest neighbour to snap with, adjust rotation in rad of game objects to align to each other
   if(this.availableConnections) {
      let deltaY = self.y - neighbour.y;
      let deltaX = self.x - neighbour.x;
      let dist = sqrt(sq(deltaX) + sq(deltaY));
      // use inverse of sine to do stuff as per deltaX and Y
      let alpha = asin(deltaY/dist);
      let angle = 0;
      deltaX > 0  && deltaY > 0 ? angle = alpha: angle = -alpha;
      self.getData('moment').sceneTextRepresentation.setRotation(angle);
      neighbour.getData('moment').sceneTextRepresentation.setRotation(angle);
    }
  }

  // update
  // 
  // used to update actors' movement (perlin noise) and handle scene transitions, and player FSM
  update(time, delta) {
    // Handle scene transition
    // this.handleSceneTransition();
    // for each scene that exists in the level, perlin noise movement
    // this.perlinMovement();    
    // Update the player's input FSM
    //if(this.World.globalPlayer) {
      // this.World.globalPlayer.PlayerFSM.step([this, this.World.globalPlayer]);
      // May trigger a random battle
      // this.headOrTail();
    //}
  }

  // Decide whether a battle scene may start or not
  headOrTail() {
    let result;
    Math.random() < 0.001? result = "head": result = "tail";
    if(result === "head" && !this.World.dialogueLock) {
      // Lock the player in a combat
      this.World.dialogueLock = true;
      // trigger battle (launches a battle scene);
      let battleMenu = this.scene.manager.getScene('UI').add.dom().createFromCache('battleMenu');
      battleMenu.setPosition(this.scale.width / 2, this.scale.height / 2);
      // Adds an onsubmit handler on each options of the battle menu
      $('#battle-menu--attack').click(() => {
          console.log("attacking");
      });
    }
  }
  // perlinMovement
  // 
  // Pippin's lectures on perlin movement from last year. Does it for scenes even
  perlinMovement() {
    this.actorsInLevel.forEach((scene) => {
      // If not already linked or being currently dragged, update position
      if(scene.parent === this.getCurrentlyDraggedScene() || scene.momentFSM.state !== 'IdleMomentState') {
        return;
      }
      let tx = scene.parent.getData('tx');
      let ty = scene.parent.getData('ty');
      let speed = scene.parent.getData('speed');
      // Update velocities based on noise 
      scene.parent.setData('vx', map(noise(tx), 0, 1, -speed, speed));
      scene.parent.setData('vy', map(noise(ty), 0, 1, -speed, speed));
      // Update the positions
      let vx = scene.parent.getData('vx');
      let vy = scene.parent.getData('vy');
      scene.parent.x += vx;
      scene.parent.y += vy;
      // Update the derivative of time wrt x and y
      scene.parent.setData('tx', tx + 0.01);
      scene.parent.setData('ty', tx + 0.02);
      // Update the camera of the scene to be that of the parented zone
      scene.refresh();
      // Handle wrapping
      this.handleWrapping(scene);      
    });
  }

  // setDraggableActiveZones
  // 
  // Caches actively used draggable zones in this scene
  setDraggableActiveZones(draggableZone) {
    // Cache only the Zones gameObjects that are active
    if(draggableZone.type === "Zone" && draggableZone.active) {
      this.draggableZonesActive.push(draggableZone);
    }
  }

  //setupBackgroundGraphics
  //
  // Raining/Snowing passive moments in the background -- may be cybernetics-like system optimizing factors in polish phase of project. Got from Phaser 3 examples
  setupBackgroundGraphics() {
    backgroundScenes = this.add.graphics();
    const backgroundSceneAmount = 15;
    // Random sized circles
    shapes = new Array(backgroundSceneAmount).fill(null).map(function (nul, i) {
      return new Phaser.Geom.Circle(Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 600), Phaser.Math.Between(25, 75));
    });
    // Rect area corresponding to the main camera
    rect = Phaser.Geom.Rectangle.Clone(this.World.cameras.main);
  }

  //createMindSpaceForm
  //
  //creates game objects using the type (mindSpaces.json) and moment parameters
    createMindSpaceForm(type, moment) {
    // Do something if scene manager is processing to prevent conflict
    if(this.scene.manager.isProcessing) {
      // WIP
      //return;
    }
    const width = this.scale.width;
    const height = this.scale.height;
    const offset = 25;
    let x = Phaser.Math.Between(offset, width - this.momentWidth * 2);
    let y = Phaser.Math.Between(offset, height - this.momentHeight * 2);

    // Create a parent zone for touch and dragging the scene
    let draggableZoneParent = this.World.add.zone(x, y, moment.WIDTH, moment.HEIGHT).setInteractive({
      draggable: true
    }).setOrigin(0);
    // Create the mind space instance and setup the drag handling
    const mindSpaces = this.cache.json.get('mindSpaces');
    const randomMindSpace = 0;
    let mindSpaceForm = new MindSpaceForm(this, x, y, draggableZoneParent, );
    let momentInstance = new moment(key, draggableZoneParent, this);
    // Set some data for this parent zone, namely its moment scene, the number of connections it has and which connections these are
    draggableZoneParent.setData({
      vx: 0,
      vy: 0,
      tx: x,
      ty: y,
      speed: 10,
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
    // Add to current draggable zones
    this.setDraggableActiveZones(draggableZoneParent);
    // Add the scenes
    this.scene.add(key, momentInstance, true);
    // Return it to keep a reference for later scene destruction
    return momentInstance;
  }

  // handleWrapping
  //
  // wraps for scenes exceeding game window
  handleWrapping(scene) {
    const width = this.scale.width;
    const height = this.scale.height;
    let parent = scene.parent;
    if (parent.x < 0) {
      parent.x += width;
    }
    else if (parent.x > width) {
      parent.x -= width;
    }
    // Off the top or bottom
    if (parent.y < 0) {
      parent.y += height;
    }
    else if (parent.y > height) {
      parent.y -= height;
    }
  }

  // handleClick
  //
  // Handle click on the zone that will pop up the sequencer data window
  handleClick(draggableZoneParent, scene) {
    draggableZoneParent.on('pointerdown', (pointer) => {
      // Play sound
      this.uiPoingSound.play();
      //On click, spawn the sequencer data window
      this.popSequencerDataWindow(scene, pointer);
    }, this.scene);
  }

  // popSequencerDataWindow
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

  // handleDialogSpawn
  //
  // handles spawning windows on scenes
  handleDialogSpawn(pointer, readSceneData, scene) {
    const OFFSET = 350;
    const HUD = this.scene.manager.getScene('Hud');
    if (this.dialog === undefined) {
      this.dialog = HUD.createDialog(this, pointer.x + OFFSET, pointer.y, readSceneData, scene);
      // If the player is locked in a scene
      if(this.scenePlayerLock) {
        // WIP
        // console.debug(dialog.getElement('choices'));
        //dialog.getElement('choices')[dialog.getElement('choices').length] = this.createLabel(this, 'Leave Dimension');
      }
    } else if (!this.dialog.isInTouching(pointer)) {
      try {
        this.dialog.destroy();
        this.dialog = undefined;
      } catch (err) {
        console.debug(err.message);
      } finally {
        console.debug("Returning anyways");
        return;
      }
    }
  }

  // handleChoices
  //
  // handles user choices in the context menu after clicking on a scene
  handleChoices(button, scene) {
    if (button.text === "Text") {
      console.debug("changing representation of scene");
      // TODO make user select this / change this...
      // let newText = greeterContent;
      // scene.sceneTextRepresentation.setText(newText);
      // Trigger the text animation
      scene.playText(true);
    } else if(button.text === "Enter Dimension") {
      console.log("Really entering dimension");
      // Global player enters the selected scene
      // Then activate a method in the scene to activate the scene's player and focus camera
      // If the scene is in snapped state and if that is the currently dragged/active scene, the player has the ability to enter it 
      if(scene.parent === this.getCurrentlyDraggedScene() && scene.momentFSM.state === "SnappedState") {
        // If the player has not been locked to a scene, allow creating a new one inside that scene
        if(!this.scenePlayerLock) {
          console.debug("Entering Dimension: " + scene.parent.name);
          // Destroy dialog box
          this.dialog.destroy();
          // Scene effects
          this.triggerSceneEffects();          
          // Remove player from this scene
          let thisPlayer = this.World.globalPlayer;
          thisPlayer.destroy();
          // Create a new player in the entered scene
          scene.initPlayer();
        }
      }
    } else if (button.text === "Leave Dimension (if entered)") {
      if(this.scenePlayerLock) {
        this.resetPlayer(scene, this);
      }
    } else if (button.text === "Confirm") {
      this.dialog.destroy();
    } else if (button.text === "Exit") {
      this.dialog.destroy();
    }
  }

  // resetPlayer(scene, controller)
  //
  // Resets the player from inside scenes to the World scene. Is also called in the SnappedState when scenes are out of range with each other
  resetPlayer(scene, controller) {
    // Destroy dialog box if it exists
    if(controller.dialog) {
      controller.dialog.destroy();
    }
    // Remove player lock to allow new creation, if it exists
    controller.scenePlayerLock = false;
    // Destroy the player from the stepped in scene
    if(scene.globalPlayer) {
      scene.destroyPlayer();
    } 
    // Make player undefined from World to reset its instance properly
    controller.World.globalPlayer = undefined;
    // Re-create player if it is undefined
    if(!controller.World.globalPlayer || controller.World.globalPlayer === undefined) {
      controller.World.globalPlayer = controller.World.createPlayer();
    }
  }

  // triggerSceneEffects
  //
  // trigger scene effects when stepping in a scene
  triggerSceneEffects() {
    this.sceneEnterSound.play();
    this.tweens.add({
      targets: this.World.globalPlayer,
      y: '+=50',
      ease: 'Bounce',
      duration: 500,
      repeat: 0,
      yoyo: false
    });
    // Flash
    this.cameras.main.flash(1000);
  }

  // Ephemeral effect on scenes
  //
  // Makes it blink
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

  //handleDrag(draggableZoneParent, momentInstance)
  //@args: draggableZoneParent {GameObject.Zone}, momentInstance {Phaser.Scene}
  //handle dragging behaviour event on each momentInstance created, by using the draggableZoneParent gameObject
  handleDrag(draggableZoneParent, momentInstance) {
    //this.input.enableDebug(draggableZoneParent);
    draggableZoneParent.on('drag', (pointer, dragX, dragY) => {
      // Smoothen the pointer
      const DAMPING = 0.75;
      pointer.smoothFactor = DAMPING;
      // Cache the currentlyDraggedScene for events handling such as Create Link
      this.setCurrentlyDraggedScene(draggableZoneParent);
      // 1. Work on Single Responsibility principle: Update display and underlying connection behaviour only
      this.updateDragZone(draggableZoneParent, dragX, dragY, momentInstance);
      // 2. A separate object to query the connections object on this particular drag zone instance
      this.querySceneConnectionManager(draggableZoneParent);
    });
  }

  // querySceneConnectionManager
  //
  // queries the connection manager to do interesting things between a scene and its closest neighbour
  querySceneConnectionManager(dragHandler) {
    // Find nearest moment scene from this gameObject being dragged along, using a Strategy pattern for flexibility
    const seekNeighbourMoment = new Context(new FindClosestNeighbour(dragHandler, this.draggableZonesActive));
    closestNeighbour = seekNeighbourMoment.operation();

    // If closest neighbour is already linked / paired to another scene, return
    if (closestNeighbour.getData('moment').momentFSM.stateArray['LinkedState'].isLinked) {
      return;
    }
    // Cache the closest neighbour and available connections found for event handling
    this.setCurrentlyDraggedSceneNeighbour(dragHandler, closestNeighbour);
    this.setAvailableConnections(dragHandler.getData('moment').momentConnectionManager.checkForAvailableConnections(dragHandler, closestNeighbour));
    // At this point, neighbour scenes in range can be snapped (and then) become locked together -- in this state, a link can be created (listened to) by the user or de-snapped when out of range
    this.handleSnapping(dragHandler, closestNeighbour);
    // Handle text bifurcation between the dragged scene and its closest neighbour
    this.handleTextBifurcation(dragHandler, closestNeighbour);
    // Adjust rotation
    this.adjustRotation(dragHandler, closestNeighbour);
  }

  // handleSnapping
  //
  // handles snapping a scene and its closest neighbour (for now displays links too). Goes through moment connection manager 
  handleSnapping(dragHandler, closestNeighbour) {
    if (this.availableConnections) {
      dragHandler.getData('moment').momentConnectionManager.snapAvailableNeighbours(dragHandler, closestNeighbour);
      this.displayLink(dragHandler, closestNeighbour, true);
    } else {
      this.displayLink(dragHandler, closestNeighbour, false);
    }
  }

  // handleTextBifurcation
  //
  // Handles text intermixing between scenes' neighbours.
  handleTextBifurcation(dragHandler, closestNeighbour) {
    if (this.availableConnections) {

    } else {

    }
  }

  // updateDragZone
  //
  // Refreshes zones' position and its scene also
  updateDragZone(draggableZoneParent, dragX, dragY, momentInstance) {
    draggableZoneParent.setPosition(dragX, dragY);
    momentInstance.refresh();
  }

  // createLinkLine
  //
  // Creates link line
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

  // createLinkButton
  //
  // Creates link button. Will be used for Gameobjects version of project
  createLinkButton() {
    this.createdLinkButtonAlready = true;
    // 1. Adding a listener to the leaveSnapState method in the SnappedState.js 
    // composed in every scene
    const width = this.scale.width;
    const height = this.scale.height;
    const offset = 150;
    this.createdLinkButton = this.World.add.circle(width - offset, height - offset, 150, '#F5F5DC').setInteractive().on('pointerdown', () => {
      this.linkButtonSound.play();
      createLinkEmitter.emit('createLink');
    });
  }

  // handleLinking
  //
  // handles scene linking
  handleLinking() {
    let self = this.getCurrentlyDraggedScene();
    let selfScene = self.getData('moment');
    let neighbour = this.getClosestNeighbour();
    let neighbourScene = neighbour.getData('moment');
    // Update the dragged scene to be the doubly linked list owner
    selfScene.setNewDoublyLinkedListOwner();
    // Shake and flash the camera for effect
    const SHAKE_AMOUNT = 250;
    self.scene.cameras.main.shake(SHAKE_AMOUNT);
    self.scene.cameras.main.flash(SHAKE_AMOUNT);
    // Create the doubly linked list if we're the owner
    selfScene.doublyLinkedList = new DoublyLinkedList(selfScene);
    // Append the closestNeighbour to the tail of the doubly linked list
    selfScene.doublyLinkedList.append(neighbourScene);
    // Destroy the link button if it exists
    if (this.getCreateLinkButton()) {
      this.getCreateLinkButton().destroy();
      this.createdLinkButtonAlready = false;
    }
    // Check if this snapped state belongs to the owner
    selfScene.isSnappedOwner = true;
    this.displaySnappedState(self, selfScene, neighbour);
    // disable dragging on both to lock them away
    this.World.input.setDraggable([self, neighbour], false);    
    // Disable link visual
    this.displayLink(self, neighbour, false);
    // Transition the dragged scene
    const context = [self, selfScene, neighbour];
    selfScene.momentFSM.transition('LinkedState', context);
    // Transition the closest neighbour
    neighbourScene.momentFSM.transition('LinkedState', context);
    // Update text bifurcation
    selfScene.momentConnectionManager.checkNeighbourTextStatus(self, neighbour);
    // Update the master linked scene list
    this.linkedScenesList.push(selfScene.doublyLinkedList);
    this.numberOfPairedScenes += 2;
    // Update player instances and player lock
    this.scenePlayerLock = false;
    // Re-create player in the world
    if(!this.World.globalPlayer) {
      this.World.globalPlayer = this.World.createPlayer();
    }
  }

  displaySnappedState() {
    // Put the same Y-pos for dragHandler and closestNeighbour
    // Set an offset between the two of 300 pixels
    const SNAP_OFFSET = 300;
    this.getClosestNeighbour().setPosition(this.getCurrentlyDraggedScene().x + SNAP_OFFSET, this.getCurrentlyDraggedScene().y);
    this.getClosestNeighbour().getData('moment').refresh();
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

  setCurrentlyDraggedSceneNeighbour(self, neighbour) {
    // Update each's neighbour
    self.setData('closestNeighbour', neighbour);
    neighbour.setData('closestNeighbour', self);
    this.currentlyDraggedSceneNeighbour = neighbour;
  }

  setAvailableConnections(value) {
    this.availableConnections = value;
  }
  
  handleSceneTransition() {
    // Check if the player changed areas
    if (this.numberOfPairedScenes >= this.areaManager(this.currentArea).nbActors - 1) {
      ++this.currentArea;
      // Reset counter of paired scenes
      this.numberOfPairedScenes = 0;
      // Fade effect
      this.cameras.main.fadeOut(1000);
      this.cameras.main.fadeIn(1000);
    }
    // Change level if it has changed from the previous one
    if (this.areaChanged() && !this.scenePlayerLock) {
      // Pause all the scenes running in parallel to prevent conflicts with deletion
      try {
        this.pauseAllScenes();
        this.removeScenes(this.actorsInLevel);
        this.refresh();
        this.restartLevelSettings();
        // this.createArea(this.currentArea);
        if(this.World.globalPlayer) {
          let thisPlayer = this.World.globalPlayer;
          thisPlayer.destroy();
        }
        this.World.globalPlayer = this.World.createPlayer();
      } catch(err) {
        console.error(err.message);
      } finally {
        console.log("WIP. Not there yet.");        
      }
    }
  }

  pauseAllScenes() {
    this.actorsInLevel.forEach( (scene) => {
      scene.scene.manager.pause(scene.scene.key);
    });
  }

  removeScenes(actorsInLevel) {
    // Destroy old zones
    for (let i = 0; i < this.draggableZonesActive.length; i++) {
      this.draggableZonesActive[i].destroy(true);
    } 
    // for(let i = 0; i < actorsInLevel.length; i++) {
    //   console.debug(actorsInLevel[i].scene.key);
    //   this.scene.remove(actorsInLevel[i].scene.key);
    // }  
    this.draggableZonesActive = [];
  }

  restartLevelSettings() {
    // Reset references
    this.currentlyDraggedScene = null;
    this.currentlyDraggedSceneNeighbour = null;
    this.createdLinkButton = null;
    this.createdLinkButtonAlready = false;
    this.availableConnections = false;
    this.linkedScenesList = [];
    this.sceneParameterOpen = false;
    this.actorsInLevel = [];
  }

  handleBgShapes() {
    // Update each shape's position
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
    // The context for (this) function is World.js
    const controller = this.scene.controller;
    if (controller.availableConnections === true) {
      // Don't recreate a button if there's already one
      if (controller.createdLinkButtonAlready) {
        return;
      }
      let linkButton = controller.createLinkButton();
      // Reset
      controller.setAvailableConnections(false);
    }
  }

  //refresh()
  //@args: none
  //Reset the position of the camera to that of the dragged zone parent (i.e., after having been dragged from Controller.js)
  refresh() {
    // Bring it to the top of the scene list render order
    this.scene.bringToTop();
  }
}
// Global variables (for now)
let closestNeighbour;
let createLinkEmitter = new Phaser.Events.EventEmitter();
let backgroundScenes;
let shapes;
let rect;
const COLOR_PRIMARY = 0x000000;
const COLOR_LIGHT = 0Xffffff;
const COLOR_DARK = 0x000000;
let soundOptions = {
  "rate": Math.random(),
  "pitch": Math.random()
}
