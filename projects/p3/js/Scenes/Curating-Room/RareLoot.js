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
      "representation": { "text": "You got a rare loot!", "sound" : null, "image" : null, "game": null },
      "action": "null",
      "consequence": "null",
      "highlight": "null",
      "ephemeral": "false",
      "speed": "1"
    };
    this.sceneTextRepresentation = null;
  }

  init() {
    console.log('Init RareLoot');
  }

  preload() {

  }

  create() {
    this.add.circle(this.parent.x, this.parent.y, 150, '#77bf5e').setOrigin(0);
    this.setupCamera();
    this.sceneTextRepresentation = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'You found \'Excalibur +10\' lying in some chest!\nThat\'s some pretty rare stuff.\nThe princess that you need to rescue\nsmiles from far away.', {
      fontFamily: 'Press Start 2P',
      fontSize: '50px'
    }).setOrigin(0.5);
    createLinkEmitter.on('createLink', this.momentFSM.stateArray['SnappedState'].leaveSnappedState);
  }

  update(time, delta) {
    // Update scene representation parameters:

    // Text
    this.sceneTextRepresentation.setText(this.sequencingData.representation.text);
    // Sound
    
    // Image

    // Game

    this.momentFSM.step([this.parent, this.parent.getData('moment'), this.parent.scene.getClosestNeighbour()]);
    if(this.momentFSM.stateArray['LinkedState'].isLinked && 
        !this.updatedLinkedScenesList) {
      // If this scene is linked and has not updated the master list yet, update the linkedScenesList master array in Controller.js
      // Update the first reference if it's null (temporary)
      if(this.parent.scene.linkedScenesList[0] === null) {
        this.parent.scene.linkedScenesList[0] = this.doublyLinkedList;
      }
      else {
        this.parent.scene.linkedScenesList.push(this.doublyLinkedList);
      }
      this.updatedLinkedScenesList = true;
      console.debug(this.parent.scene.linkedScenesList);
    }
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