class RareLoot extends Phaser.Scene {
    constructor(key, parent) {
      super(key);
      this.parent = parent;
      this.count = 0;
    }
  
    init() {
      console.log('Init RareLoot');
    }
  
    preload() {

    }
  
    create() {
      this.add.circle(this.parent.x, this.parent.y, 150, '#77bf5e').setOrigin(0);
      this.setupCamera();
      let thisText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'You found Excalibur +10!\nThe princess that you need to rescue\nsmiles from far away.', { fontFamily: 'Press Start 2P', fontSize: '50px' }).setOrigin(0.5);
    }
  
    update(time, delta) {
  
    }

    setupCamera() {
      this.cameras.main.setPosition(this.parent.x, this.parent.y);
      this.cameras.main.setSize(GoodNPCPunchLine.WIDTH, GoodNPCPunchLine.HEIGHT);
      //this.cameras.main.setViewport(this.parent.x, this.parent.y, GoodNPCPunchLine.WIDTH, GoodNPCPunchLine.HEIGHT);
      this.cameras.main.setScroll(this.parent.x, this.parent.y, GoodNPCPunchLine.WIDTH, GoodNPCPunchLine.HEIGHT);
    }

    refresh ()
    {
      this.cameras.main.setPosition(this.parent.x, this.parent.y);
      this.scene.bringToTop();
    }
  }
  
  RareLoot.WIDTH = 300;
  RareLoot.HEIGHT = 300;