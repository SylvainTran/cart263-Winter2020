class GoodNPCPunchLine extends Phaser.Scene {
    constructor(key, parent) {
      super(key);
      this.parent = parent;
      this.count = 0;
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
      let thisText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'George the Blacksmith NPC says:\nI bet I lift more than your dad does.\nRelationship + 10.', { fontFamily: 'Press Start 2P', fontSize: '50px' }).setOrigin(0.5);
      // Temporary
      // thisText.setFontStyle('Press Start 2P');
      // thisText.setFontSize('50px');
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
      
    }

    refresh ()
    {
      this.cameras.main.setPosition(this.parent.x, this.parent.y);
      this.scene.bringToTop();
    }
  }

  GoodNPCPunchLine.WIDTH = 300;
  GoodNPCPunchLine.HEIGHT = 300;
  