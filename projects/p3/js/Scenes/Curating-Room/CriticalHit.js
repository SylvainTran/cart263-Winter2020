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
  }

  init() {
    console.log('Init CriticalHit');
  }

  preload() {

  }

  create() {
    this.add.circle(this.parent.x, this.parent.y, 150, '#77bf5e').setOrigin(0);
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