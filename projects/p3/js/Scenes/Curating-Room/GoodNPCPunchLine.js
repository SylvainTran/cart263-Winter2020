class GoodNPCPunchLine extends Moment {
  constructor(key, parent, controller) {
    super(key);
    this.parent = parent; // The draggable zone
    this.controller = controller;
    this.count = 0;
    this.momentConnectionManager = new MomentConnectionManager(this);
    this.momentFSM = new StateMachine('IdleMomentState', {
      IdleMomentState: new IdleMomentState(),
      SnappedState: new SnappedState(),
      LinkedState: new LinkedState()
    }, [parent, this]);
    // Snap flag that says this is scene has already been snapped with a currently neighbour
    this.isSnappedOwner = false;
    // Double-linked list variables
    this.doublyLinkedList = null;
    this.isDoublyLinkedListOwner = false; // Is this scene the owner (i.e., head or first scene) of a current scene linked list sequence?
    this.previous = null; // The previous connected moment to this scene in the linked list
    this.next = null; // The next connected moment to this scene in the linked list    
    // Whether this scene has updated the linked scene list variable in Controller.js already
    this.updatedLinkedScenesList = false;
    // Text from JSON
    this.text = `If music be the food of love, play on,
    Give me excess of it; that surfeiting,
    The appetite may sicken, and so die.`;
    // Sequencing Parameters (JSON format for localStorage)
    this.sequencingData = {
      "sound": "false",
      "volume": "0",
      "loop": "false",
      "representation": { "text": this.text, "sound" : null, "image" : null, "game": false },
      "action": "null",
      "consequence": "null",
      "highlight": "null",
      "ephemeral": "false",
      "speed": "1"
    };
    this.sceneTextRepresentation = null;
    // Text position for animation
    this.sceneTextPosX = null;
    this.sceneTextPosY = null;
    // Flag for animation
    this.playingTextAnimation = false;    
    // Player instance in this world
    this.globalPlayer = null;
    // Black circle marker
    this.circle = null;
    // Spawn point for player teleportation
    this.spawnPoint = null;
    // Footstep sound
    this.footstepSound = null;    
  }

  init() {
    console.log('Init GoodNPCPunchLine');
  }

  preload() {

  }

  create() {
    this.circle = this.add.circle(this.parent.x, this.parent.y, 150, '#77bf5e').setOrigin(0);
    this.setupCamera();
    this.debugZoneViewport();
    // Setup text initial position and content
    this.sceneTextPosX = this.cameras.main.centerX;
    this.sceneTextPosY = this.cameras.main.centerY;
    this.sceneTextRepresentation = this.add.text(this.sceneTextPosX, this.sceneTextPosY, 'You landed a critical hit!\nMassive Bonus Exp gained.', {
      fontFamily: 'Press Start 2P',
      fontSize: '50px'
    }).setOrigin(0.5);
    this.spawnPoint = this.add.zone(this.circle.x, this.circle.y, 64, 64);
    // Physics bounds
    this.physics.world.setBounds(this.spawnPoint.x, this.spawnPoint.y, this.circle.geom.radius * 2, this.circle.geom.radius *2);
    // Footstep sounds
    this.footstepSound = this.sound.add('footstepWater');    
  }


  setSceneTextRepresentation(value) {
    if(value) {
      let updatedText = this.sceneTextRepresentation.text + "\n" + value;
      this.sceneTextRepresentation.setText(updatedText);
    }
  }

  playText(playTextAnimation) {
    playTextAnimation? this.playingTextAnimation = true: this.playingTextAnimation = false;
  }

  playTextAnimation() {
    if(this.playingTextAnimation) {
      // Increment pos value
      const INCREASE_POS_Y = 5;
      this.sceneTextPosY += INCREASE_POS_Y;
      // Wrap back up when done, shake camera, and change text color then
      if (this.sceneTextPosY  >= this.scale.height) {
        this.sceneTextPosY = 0;
      }
      // Update display
      this.sceneTextRepresentation.setPosition(this.sceneTextPosX, this.sceneTextPosY);
    }
  }

  // When the Global Player enters this scene's (dimension), then an instance of the player of this scene is rendered
  // and enabled for keyboard input
  initPlayer() {
    this.globalPlayer = this.createPlayer();
  }

  createPlayer() {
    if(this.globalPlayer) {
      let thisPlayer = this.globalPlayer;
      thisPlayer.destroy(true);
    }
    // Lock the player as unique in the Controller
    this.parent.scene.scenePlayerLock = true;
    // Spawn the player in the resized scene
    const sceneScaleFactor = 1;
    this.globalPlayer = new Player(this, this.spawnPoint.x + this.circle.geom.radius, this.spawnPoint.y + this.circle.geom.radius, "hero");
    this.globalPlayer.setSize(64, 64).setScale(sceneScaleFactor);
    this.globalPlayer.setCollideWorldBounds(true);
    // Camera follow
    // this.cameras.main.startFollow(this.globalPlayer, true, 0.05, 0.05);
    // this.cameras.main.setZoom(2);
    // Reposition / Transfer player between this scene and its closest neighbour
    let closestNeighbour = this.parent.getData('closestNeighbour').getData('moment');
    // Add a pointerdown event only once to prevent duplicates
    this.parent.getData('closestNeighbour').once("pointerdown", (pointer, gameObject) => {
      // Flash
      if(this.globalPlayer) {
        closestNeighbour.cameras.main.flash(1000);
        this.cameras.main.flash(1000);  
        // Destroy 
        console.debug(this.globalPlayer);
        this.destroyPlayer();
        // Create a player in the closest neighbour
        closestNeighbour.createPlayer();
      }
    });
    return this.globalPlayer;
  }

  destroyPlayer() {
    let thisPlayer = this.globalPlayer;
    thisPlayer.destroy(true);
    this.globalPlayer = null;
  }

  //debugZoneViewport()
  //@args: none
  //debugging viewport stuff
  debugZoneViewport() {
    console.debug("Zone at (x, y): " + this.parent.x + ", " + this.parent.y); // The draggable zone parent container is the position of the camera
    console.debug("Camera viewport (x, y): " + this.cameras.main.centerX + ", " + this.cameras.main.centerY); // Should be at the center of the camera's viewport relative to the left of the game canvas
  }

  setupCamera() {
    this.cameras.main.setPosition(this.parent.x, this.parent.y);
    this.cameras.main.setSize(GoodNPCPunchLine.WIDTH, GoodNPCPunchLine.HEIGHT);
    //this.cameras.main.setViewport(this.parent.x, this.parent.y, GoodNPCPunchLine.WIDTH, GoodNPCPunchLine.HEIGHT);
    this.cameras.main.setScroll(this.parent.x, this.parent.y, GoodNPCPunchLine.WIDTH, GoodNPCPunchLine.HEIGHT);
  }

  update(time, delta) {
    // Update scene representation parameters:

    // Change the y pos of the text from top to down (animate)
    this.playTextAnimation();    

    // Text
    // this.sceneTextRepresentation.setText(this.sequencingData.representation.text);
    // Sound
    
    // Image

    // Game
    if(this.globalPlayer) {
      this.globalPlayer.PlayerFSM.step([this, this.globalPlayer]);
    }
    this.momentFSM.step([this.parent, this.parent.getData('moment'), this.controller.getClosestNeighbour()]);  
  }
  
  // Set this moment as the owner of the linked list
  setNewDoublyLinkedListOwner() {
    this.isDoublyLinkedListOwner = true;
  }

  refresh() {
    this.cameras.main.setPosition(this.parent.x, this.parent.y);
    this.scene.bringToTop();
  }
}

GoodNPCPunchLine.WIDTH = 300;
GoodNPCPunchLine.HEIGHT = 300;