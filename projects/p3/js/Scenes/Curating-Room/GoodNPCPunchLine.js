class GoodNPCPunchLine extends Moment {
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
    this.doublyLinkedList = new DoublyLinkedList(this);
    this.isDoublyLinkedListOwner = false; // Is this scene the owner (i.e., head or first scene) of a current scene linked list sequence?
    this.previous = null; // The previous connected moment to this scene in the linked list
    this.next = null; // The next connected moment to this scene in the linked list    
  }

  init() {
    console.log('Init GoodNPCPunchLine');
  }

  preload() {

  }

  create() {
    this.add.circle(this.parent.x, this.parent.y, 150, '#77bf5e').setOrigin(0);
    this.setupCamera();
    this.debugZoneViewport();
    let thisText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'George the Blacksmith NPC says:\nI bet I lift more than your dad does.\nRelationship + 10.', {
      fontFamily: 'Press Start 2P',
      fontSize: '50px'
    }).setOrigin(0.5);
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
    this.momentFSM.step([this.parent, this, closestNeighbour]);
  }

  refresh() {
    this.cameras.main.setPosition(this.parent.x, this.parent.y);
    this.scene.bringToTop();
  }
}

GoodNPCPunchLine.WIDTH = 300;
GoodNPCPunchLine.HEIGHT = 300;