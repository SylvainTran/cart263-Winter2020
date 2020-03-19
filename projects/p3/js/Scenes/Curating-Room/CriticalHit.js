class CriticalHit extends Phaser.Scene {
    constructor(key, parent) {
      super(key);
      this.parent = parent;
      this.count = 0;
    }
  
    init() {
      console.log('Init CriticalHit');
    }
  
    preload() {

    }
  
    create() {
      this.add.circle(this.parent.x, this.parent.y, 150, '#77bf5e').setOrigin(0);
      this.setupCamera();
    }

    //setupCamera()
    //@args: none
    //setup the camera positions, size and scroll view
    setupCamera() {
      this.cameras.main.setPosition(this.parent.x, this.parent.y);
      this.cameras.main.setSize(GoodNPCPunchLine.WIDTH, GoodNPCPunchLine.HEIGHT);
      //this.cameras.main.setViewport(this.parent.x, this.parent.y, GoodNPCPunchLine.WIDTH, GoodNPCPunchLine.HEIGHT);
      this.cameras.main.setScroll(this.parent.x, this.parent.y, GoodNPCPunchLine.WIDTH, GoodNPCPunchLine.HEIGHT);
    }
  
    update(time, delta) {
  
    }

    //refresh()
    //@args: none
    //Reset the position of the camera to that of the dragged zone parent (i.e., after having been dragged from Controller.js)
    refresh (){
      this.cameras.main.setPosition(this.parent.x, this.parent.y);
      // Bring it to the top of the scene list render order
      this.scene.bringToTop();
    }
  }

  CriticalHit.WIDTH = 300;
  CriticalHit.HEIGHT = 300;