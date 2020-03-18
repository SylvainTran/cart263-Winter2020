class BootScene extends Phaser.Scene {
    constructor() {
      super({key: 'boot'});
    }
  
    init() {
  
    }
  
    preload() {

    }
  
    create() {
      //$(this.game.canvas).draggable({containment: "parent"}); // Restrain to x-axis (also the div flex colum direction does this somehow)
      this.game.canvas.style.zIndex = 1;
      this.scene.start('Controller');
    }
  
    update(time, delta) {

    }
  }  