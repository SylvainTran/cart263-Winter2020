class RareLoot extends Phaser.Scene {
    constructor(key, parent) {
      super(key);
      this.parent = parent;
      this.count = 0;
      this.WIDTH = 250;
      this.HEIGHT = 250;
    }
  
    init() {
      console.log('Init RareLoot');
    }
  
    preload() {

    }
  
    create() {
      this.add.star(450, 450, 5, 100, 100, '#77bf5e');
    }
  
    update(time, delta) {
  
    }
  }
  