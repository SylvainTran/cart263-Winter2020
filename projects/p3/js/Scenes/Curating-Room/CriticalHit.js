class CriticalHit extends Moment {
  constructor(key, parent) {
    super(key);
    this.parent = parent; // The draggable zone
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
    // Sequencing Parameters (JSON format for localStorage)
    this.sequencingData = {
      "sound": "false",
      "volume": "0",
      "loop": "false",
      "representation": { "text": "Ridiculous.", "sound" : null, "image" : null, "game": false },
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
  }

  init() {
    console.log('Init CriticalHit');
  }

  preload() {

  }

  create() {
    this.circle = this.add.circle(this.parent.x, this.parent.y, 150, '#77bf5e').setOrigin(0);
    this.setLinkLineVisible(false);
    this.setupCamera();
    // Setup text initial position and content
    this.sceneTextPosX = this.cameras.main.centerX;
    this.sceneTextPosY = this.cameras.main.centerY;
    this.sceneTextRepresentation = this.add.text(this.sceneTextPosX, this.sceneTextPosY, 'You landed a critical hit!\nMassive Bonus Exp gained.', {
      fontFamily: 'Press Start 2P',
      fontSize: '50px'
    }).setOrigin(0.5);
  }

  // When the Global Player enters this scene's (dimension), then an instance of the player of this scene is rendered
  // and enabled for keyboard input
  initPlayer() {
    alert("init from inside the scene");
    this.globalPlayer = this.createPlayer();
    console.debug(this.globalPlayer);
  }

  createPlayer() {
    // Increase size of circle to create the effect of creating a big world
    const TRUE_SIZE = 300;
    const MARGIN = 100;
    this.circle.geom.setTo(this.circle.x, this.circle.y, TRUE_SIZE);
    // Update size of drag handler parent too
    this.parent.setSize(TRUE_SIZE * 2, TRUE_SIZE * 2, true);
    // Update text offset as well
    this.sceneTextPosX += TRUE_SIZE/2;
    this.sceneTextPosY += TRUE_SIZE;
    // Spawn the player in the resized scene
    const spawnPoint = this.add.zone(this.circle.x, this.circle.y, TRUE_SIZE, TRUE_SIZE);
    const sceneScaleFactor = 0.75;
    this.globalPlayer = new Player(this, spawnPoint.x + TRUE_SIZE, spawnPoint.y + TRUE_SIZE, "hero");
    this.globalPlayer.setSize(64, 64).setScale(sceneScaleFactor);
    // Physics bounds
    this.physics.world.setBounds(spawnPoint.x, spawnPoint.y, TRUE_SIZE * 2, TRUE_SIZE * 2);
    this.globalPlayer.setCollideWorldBounds(true);
    // Camera follow
    // this.cameras.main.startFollow(this.globalPlayer, true, 0.05, 0.05);
    // this.cameras.main.setZoom(1);
    // Position the camera inside the black circle
    this.cameras.main.setSize(TRUE_SIZE * 2, TRUE_SIZE * 2);
    this.cameras.main.setBounds(spawnPoint.x, spawnPoint.y, TRUE_SIZE, TRUE_SIZE, true);
    return this.globalPlayer;
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

  //setupCamera()
  //@args: none
  //setup the camera positions, size and scroll view
  setupCamera() {
    this.cameras.main.setPosition(this.parent.x, this.parent.y);
    this.cameras.main.setSize(CriticalHit.WIDTH, CriticalHit.HEIGHT);
    this.cameras.main.setScroll(this.parent.x, this.parent.y, GoodNPCPunchLine.WIDTH, GoodNPCPunchLine.HEIGHT);
  }

  update(time, delta) {
    // Update scene representation parameters:

    // Text
    // Change the y pos of the text from top to down (animate)
    this.playTextAnimation();    
    
    // this.sceneTextRepresentation.setText(this.sequencingData.representation.text);
    // Sound

    // Image
    
    // Game
    // Player input
    // Update the player's FSM if there's a player
    if(this.globalPlayer) {
      this.globalPlayer.PlayerFSM.step([this, this.globalPlayer]);
    }
    this.momentFSM.step([this.parent, this.parent.getData('moment'), this.parent.scene.getClosestNeighbour()]);
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

  // Set this moment as the owner of the linked list
  setNewDoublyLinkedListOwner() {
    this.isDoublyLinkedListOwner = true;
  }

  //refresh()
  //@args: none
  //Reset the position of the camera to that of the dragged zone parent (i.e., after having been dragged from Controller.js)
  refresh() {
    this.cameras.main.setPosition(this.parent.x, this.parent.y);
    // Bring it to the top of the scene list render order
    this.scene.bringToTop();
  }
}

CriticalHit.WIDTH = 300;
CriticalHit.HEIGHT = 300;