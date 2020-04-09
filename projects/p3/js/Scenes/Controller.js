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
    // Current level of the game at and its previous one for checking if it changed
    this.previousLevel = 0;
    this.currentLevel = 0;
    // level config
    this.levelConfig = null;
    // Level's moment references (for later scene destruction)
    this.scenesInLevel = [];
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
  }

  init() {
    // Scenes' determined width and height
    this.momentWidth = 150;
    this.momentHeight = 150;
  }

  preload() {
    this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
  }

  // Assigns the number of moments for each level
  levelManager(level) {
    let numberOfMoments = 0;
    let moments = [];
    switch (level) {
      case 0: numberOfMoments = 2; moments = [CriticalHit, RareLoot]; break;
      case 1: numberOfMoments = 3; moments = [GoodNPCPunchLine, RareLoot, CriticalHit]; break;
      case 2: numberOfMoments = 4; moments = [RareLoot, CriticalHit, GoodNPCPunchLine, RareLoot]; break;
      default: numberOfMoments = 2; break;
    }
    const levelConfig = {
      numberOfMoments: numberOfMoments,
      moments: moments
    };
    return levelConfig;
  }

  create() {
    // Player sounds
    this.playerCreatedSound = this.sound.add('zap');
    // Controller for the player in the main world
    this.createPlayer();

    // Set-up an event handler
    createLinkEmitter.on('createLink', this.handleLinking, this);
    // Spawn the greeter dialog box to introduce the game
    this.createTextBox(this, 100, 100, {
      wrapWidth: 700,
      fixedWidth: 750,
      fixedHeight: 100,
    }).start(greeterContent, 50);

    // Level Management - Starting at level 0. Will be refactored into event-driven pattern later
    this.createLevel();
    // Create the main canvas that will display optimizing behaviours of systems in the back or interactively display stats
    this.createMainCanvas(true);
    // Spawn a contextual button for linking scenes only if there are snapped scenes
    // And if and only if at drag end to prevent multiple buttons
    this.input.on('dragend', this.spawnContextualButton);
    // Create the line used for linking scenes
    this.linkLine = this.createLinkLine(this.momentWidth, this.momentHeight, 0, 0, 100, 100, 0x000000, 5, true);
    // Make it invisible until connections start being made between scenes
    this.setLinkLineVisible(false);
    // Setup background graphics
    this.setupBackgroundGraphics();
    // Setup camera
    // this.cameras.main.startFollow(this.globalPlayer, true, 0.05, 0.05);
    // this.cameras.main.setBounds(this.scale.width/2, this.scale.height/2, 320, 320, true);
    // this.cameras.main.setSize(320, 320);

    // Sounds
    this.uiPoingSound = this.sound.add('ui-poing');
    this.linkButtonSound = this.sound.add('linkButton');
    this.sceneEnterSound = this.sound.add('sceneEnter');
    this.pianoTheme = this.sound.add('pianoTheme');
    this.pianoTheme.play();
    // Footstep sounds
    this.footstepSound = this.sound.add('footstepDirt');
  }

  adjustRotation(self, neighbour) {
    // If there is an available closest neighbour to snap with, adjust rotation in rad of game objects to align to each other
   if(this.availableConnections) {
      let deltaY = self.y - neighbour.y;
      let deltaX = self.x - neighbour.x;
      let dist = sqrt(sq(deltaX) + sq(deltaY));
      let alpha = asin(deltaY/dist);
      let angle = 0;
      deltaX > 0  && deltaY > 0 ? angle = alpha: angle = -alpha;
      self.getData('moment').sceneTextRepresentation.setRotation(angle);
      neighbour.getData('moment').sceneTextRepresentation.setRotation(angle);
    }
  }

  update(time, delta) {
    // Handle scene transition
    this.handleSceneTransition();

    // Oscillate scenes
    // for each scene that exists in the level, perlin noise movement
    this.perlinMovement();
    
    // Generate datasets

    // Update shapes' position and display
    // this.handleBgShapes();

    // Player input
    // Update the player's FSM
    if(this.globalPlayer) {
      this.globalPlayer.PlayerFSM.step([this, this.globalPlayer]);
    }
  }

  perlinMovement() {
    this.scenesInLevel.forEach((scene) => {
      // If not already linked or being currently dragged, update position
      if(scene.parent === this.getCurrentlyDraggedScene() || scene.momentFSM.state !== 'IdleMomentState') {
        return;
      }
      // else if (scene.parent === this.getCurrentlyDraggedScene()) {
        // Reset currently dragged scene after 3 seconds to give some time for the player to decide if they want to link the scene or not
        // setTimeout( () => { 
        //   this.setCurrentlyDraggedScene(null);
        // }, 3000);
        // // Destroy the create link button
        // if (this.getCreateLinkButton()) {
        //   this.getCreateLinkButton().destroy();
        //   this.createdLinkButtonAlready = false;
        // }    
        // return;
      // }
      // Adjust dragged scene objects' rotation

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

  setDraggableActiveZones(draggableZone) {
    // Cache only the Zones gameObjects that are active
    if(draggableZone.type === "Zone" && draggableZone.active) {
      this.draggableZonesActive.push(draggableZone);
    }
  }

  createLevel() {
    // TODO store local storage
    if(this.linkedScenesList) {
      //localStorage.setItem("Level", this.linkedScenesList);
      //JSON.parse(localStorage.getItem("Level"));  
    }

    // Get the current level's config by querying the level manager with the current level
    const levelConfig = this.levelManager(this.currentLevel);
    const numberOfMoments = levelConfig.numberOfMoments;
    const moments = levelConfig.moments;
    
    for (let i = 0; i < numberOfMoments; i++) {
      // Add a random hash at the end for now to prevent duplicate keys
      let randomHash =  i + Math.random() + Math.random();
      // Create the moment and also cache it for later destruction
      this.scenesInLevel.push(this.createMoment(moments[i].name + randomHash, moments[i]));
    }
    return this.scenesInLevel;
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
  }

  //createMoment(key, moment)
  //@args: key {string}, moment {Phaser.Scene}
  //creates scenes using the key and moment parameters
  createMoment(key, moment) {
    // Do something if scene manager is processing to prevent conflict
    if(this.scene.manager.isProcessing) {
      // WIP
      //return;
    }
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
    // Add collider with player
    this.physics.add.collider(this.globalPlayer, draggableZoneParent, () => { console.log("collided with a scene"); }, () => { return true; }, this);
    // Add to current draggable zones
    this.setDraggableActiveZones(draggableZoneParent);
    // Add the scenes
    this.scene.add(key, momentInstance, true);
    // Return it to keep a reference for later scene destruction
    return momentInstance;
  }

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

  // Handle click on the zone that will pop up the sequencer data window
  handleClick(draggableZoneParent, scene) {
    draggableZoneParent.on('pointerdown', (pointer) => {
      // Play sound
      this.uiPoingSound.play();
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
      dialog = this.createDialog(this, pointer.x + OFFSET, pointer.y, readSceneData, scene);
      // If the player is locked in a scene
      if(this.scenePlayerLock) {
        // WIP
        // console.debug(dialog.getElement('choices'));
        //dialog.getElement('choices')[dialog.getElement('choices').length] = this.createLabel(this, 'Leave Dimension');
      }
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
      let newText = greeterContent;
      scene.sceneTextRepresentation.setText(newText);
      // Trigger the text animation
      scene.playText(true);
    } else if(button.text === "Enter Dimension") {
      // Global player enters the selected scene
      // Then activate a method in the scene to activate the scene's player and focus camera
      // If the scene is in snapped state and if that is the currently dragged/active scene, the player has the ability to enter it 
      if(scene.parent === this.getCurrentlyDraggedScene() && scene.momentFSM.state === "SnappedState") {
        console.debug("Entering Dimension: " + scene.parent.name);
        // If the player has not been locked to a scene, allow creating a new one inside that scene
        if(!this.scenePlayerLock) {
          // Destroy dialog box
          dialog.destroy();
          // Scene effects
          this.triggerSceneEffects();          
          // Remove player from this scene
          let thisPlayer = this.globalPlayer;
          thisPlayer.destroy();
          // Create a new player in the entered scene
          scene.initPlayer();
        }
      }
    } else if (button.text === "Leave Dimension (if entered)") {
      if(this.scenePlayerLock) {
        // Destroy dialog box
        dialog.destroy();
        // Remove player lock to allow new creation
        this.scenePlayerLock = false;
        scene.destroyPlayer();
        // Re-create player
        this.globalPlayer = this.createPlayer();
      }
    } else if (button.text === "Sound") {
      if (scene.sceneTextRepresentation) {
        // Read the scene as speak
        this.handleResponsiveVoice(scene);
      }
    } else if (button.text === "Image") {
      //TODO        
    } else if (button.text === "Game") {
      // Flag the scene as a mini-playable in the sequencing room
      scene.sequencingData.representation.game = true;
    } else if (button.text === "Ephemeral") {
      this.handleEphemeral(scene);
    } else if (button.text === "Confirm") {
      dialog.destroy();
    } else if (button.text === "Exit") {
      dialog.destroy();
    }
  }

  triggerSceneEffects() {
    this.sceneEnterSound.play();
    this.tweens.add({
      targets: this.globalPlayer,
      y: '+=50',
      ease: 'Bounce',
      duration: 500,
      repeat: 0,
      yoyo: false
    });
    // Flash
    this.cameras.main.flash(1000);
  }

  createPlayer() {
    const spawnPoint = this.add.zone(this.scale.width / 2, this.scale.height / 2, 128, 128);
    const controllerScaleFactor = 2.5;
    this.globalPlayer = new Player(this, spawnPoint.x, spawnPoint.y, "hero");
    // Physics bounds
    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);
    this.globalPlayer
    .setCollideWorldBounds(true)
      .setSize(64, 64).setScale(controllerScaleFactor)      
        .setInteractive();
    console.debug(this.playerCreatedSound);
    this.playerCreatedSound.play();
    return this.globalPlayer;
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
        title: createLabel(this, 'Actions').setDraggable(),
        //content: createLabel(this, ''),
        //description: createLabel(this, sceneClicked.parent.name),
        choices: [
          createLabel(this, 'Text'),
          createLabel(this, 'Enter Dimension'),
          createLabel(this, 'Leave Dimension (if entered)'),
          // createLabel(this, 'Image'),
          // createLabel(this, 'Game'),
          // createLabel(this, 'Ephemeral')
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
    //this.input.enableDebug(draggableZoneParent);
    draggableZoneParent.on('drag', (function (pointer, dragX, dragY) {
      if (!this.sceneParameterOpen) {
        // Smoothen the pointer
        const DAMPING = 0.75;
        pointer.smoothFactor = DAMPING;
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
    this.setCurrentlyDraggedSceneNeighbour(dragHandler, closestNeighbour);
    this.setAvailableConnections(dragHandler.getData('moment').momentConnectionManager.checkForAvailableConnections(dragHandler, closestNeighbour));

    // At this point, neighbour scenes in range can be snapped (and then) become locked together -- in this state, a link can be created (listened to) by the user or de-snapped when out of range
    this.handleSnapping(dragHandler, closestNeighbour);
    // Handle text bifurcation between the dragged scene and its closest neighbour
    this.handleTextBifurcation(dragHandler, closestNeighbour);
    // Adjust rotation
    this.adjustRotation(dragHandler, closestNeighbour);
  }

  handleSnapping(dragHandler, closestNeighbour) {
    if (this.availableConnections) {
      dragHandler.getData('moment').momentConnectionManager.snapAvailableNeighbours(dragHandler, closestNeighbour);
      this.displayLink(dragHandler, closestNeighbour, true);
    } else {
      this.displayLink(dragHandler, closestNeighbour, false);
    }
  }

  handleTextBifurcation(dragHandler, closestNeighbour) {
    if (this.availableConnections) {

    } else {

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

  createLinkButton() {
    this.createdLinkButtonAlready = true;
    // 1. Adding a listener to the leaveSnapState method in the SnappedState.js 
    // composed in every scene
    const width = this.scale.width;
    const height = this.scale.height;
    const offset = 150;
    this.createdLinkButton = this.add.circle(width - offset, height - offset, 150, '#F5F5DC').setInteractive().on('pointerdown', () => {
      this.linkButtonSound.play();
      createLinkEmitter.emit('createLink');
    });
  }

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
    this.input.setDraggable([self, neighbour], false);    
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
    // Re-create player
    if(!this.globalPlayer) {
      this.globalPlayer = this.createPlayer();
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

  // Only check if the level changed
  levelChanged() {
    let levelChanged = this.currentLevel > this.previousLevel ? true : false;
    if (levelChanged) {
      // Update the last level's index if the current one changed
      this.previousLevel = this.currentLevel;
    }
    return levelChanged;
  }

  handleSceneTransition() {
    // Check if all the scenes for a level are linked to trigger end of level screen
    if (this.numberOfPairedScenes >= this.levelManager(this.currentLevel).numberOfMoments - 1) {
      ++this.currentLevel;
      // Reset counter of paired scenes
      this.numberOfPairedScenes = 0;
      // Fade effect
      this.cameras.main.fadeOut(1000);
      this.cameras.main.fadeIn(1000);
    }
    // Change level if it has changed from the previous one
    if (this.levelChanged() && !this.scenePlayerLock) {
      // Pause all the scenes running in parallel to prevent conflicts with deletion
      try {
        this.pauseAllScenes();
        this.removeScenes(this.scenesInLevel);
        this.refresh();
        this.restartLevelSettings();
        this.createLevel(this.currentLevel);
        if(this.globalPlayer) {
          let thisPlayer = this.globalPlayer;
          thisPlayer.destroy();
        }
        this.globalPlayer = this.createPlayer();
      } catch(err) {
        console.error(err.message);
      } finally {
        console.log("WIP. Not there yet.");        
      }
    }
  }

  pauseAllScenes() {
    this.scenesInLevel.forEach( (scene) => {
      scene.scene.manager.pause(scene.scene.key);
    });
  }

  removeScenes(scenesInLevel) {
    // Destroy old zones
    for (let i = 0; i < this.draggableZonesActive.length; i++) {
      this.draggableZonesActive[i].destroy(true);
    } 
    // for(let i = 0; i < scenesInLevel.length; i++) {
    //   console.debug(scenesInLevel[i].scene.key);
    //   this.scene.remove(scenesInLevel[i].scene.key);
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
    this.scenesInLevel = [];
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
    if (this.scene.getAvailableConnections() === true) {
      // Don't recreate a button if there's already one
      if (this.scene.createdLinkButtonAlready) {
        return;
      }
      let linkButton = this.scene.createLinkButton();
      // Reset
      this.scene.setAvailableConnections(false);
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
let dialog;
const COLOR_PRIMARY = 0x000000;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x000000;
let soundOptions = {
  "rate": Math.random(),
  "pitch": Math.random()
}

// Fyodor Dostoevsky
let greeterContent = 
`I am a ridiculous person. Now they call me a madman. 
That would be a promotion if it were not that I remain 
as ridiculous in their eyes as before. But now I do not 
resent it, they are all dear to me now, even when they 
laugh at me -and, indeed, it is just then that they are 
particularly dear to me. I could join in their laughter--not 
exactly at myself, but through affection for them, if I did 
not feel so sad as I look at them. Sad because they do not 
know the truth and I do know it. Oh, how hard it is to be 
the only one who knows the truth! But they won't understand 
that. No, they won't understand it.`;

let oldGreeterContent = `Tutorial: You are in the curating room.
Tutorial: Her Grace, the Horizon Princess XIV--blessed be her sacred name, and long live her rule--wishes to impart some of her wise words to you.\nThe Horizon Princess: Gyaarg! Did you expect some weak frill in a dress? Hah! Sorry to disappoint. So you're the new recruit? Well, let's see how long you last.
Listen up closely, rookie. By clicking on one of these circle-looking things, you can choose how to represent their meaning.
Hey, don't ask me what it means, I'm just repeating what the Emperor told me. Drag one of these circles next to another one and link them by pressing the 'Create Link' button on the bottom right of the screen.
All these cute little circles--along with what they've got inside--will go in the Sequencing Room. (That's the link at the top). There, you'll have to deal with your choices. 
Got it? That's how you do it. Go ahead now and try linking up two circles.`;

let questOneNarrationContent = `The Horizon Princess: I have a quest for you. Seriously, you didn't do too bad for a first timer.\nThe Horizon Princess: The dungeons
leading to my personal library were raided. My guards have forgotten 
what the brigands looked like and even locked themselves down there accidently!\n
The Horizon Princess: Please find a way to break the door open.`;

let progressNotification = `You earned your loot! The horizon princess's library is expanding.`;