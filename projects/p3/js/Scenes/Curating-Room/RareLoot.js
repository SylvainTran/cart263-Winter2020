class RareLoot extends Moment {
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
    console.log(this.momentFSM.state);
    // Double-linked list variables
    this.doublyLinkedList = new DoublyLinkedList(this);
    this.isDoublyLinkedListOwner = false; // Is this scene the owner (i.e., head or first scene) of a current scene linked list sequence?
    this.previous = null; // The previous connected moment to this scene in the linked list
    this.next = null; // The next connected moment to this scene in the linked list
  }

  init() {
    console.log('Init RareLoot');
  }

  preload() {

  }

  create() {
    this.add.circle(this.parent.x, this.parent.y, 150, '#77bf5e').setOrigin(0);
    this.setupCamera();
    let thisText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'You found \'Excalibur +10\' lying in some chest!\nThat\'s some pretty rare stuff.\nThe princess that you need to rescue\nsmiles from far away.', {
      fontFamily: 'Press Start 2P',
      fontSize: '50px'
    }).setOrigin(0.5);
  }

  update(time, delta) {
    this.momentFSM.step([this.parent, this, closestNeighbour]);
  }

  setupCamera() {
    this.cameras.main.setPosition(this.parent.x, this.parent.y);
    this.cameras.main.setSize(GoodNPCPunchLine.WIDTH, GoodNPCPunchLine.HEIGHT);
    //this.cameras.main.setViewport(this.parent.x, this.parent.y, GoodNPCPunchLine.WIDTH, GoodNPCPunchLine.HEIGHT);
    this.cameras.main.setScroll(this.parent.x, this.parent.y, GoodNPCPunchLine.WIDTH, GoodNPCPunchLine.HEIGHT);
  }

  refresh() {
    this.cameras.main.setPosition(this.parent.x, this.parent.y);
    this.scene.bringToTop();
  }
}

RareLoot.WIDTH = 300;
RareLoot.HEIGHT = 300;