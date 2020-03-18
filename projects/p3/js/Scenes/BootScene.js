class BootScene extends Phaser.Scene {
    constructor() {
      super({key: 'boot'});
    }
  
    init() {
  
    }
  
    preload() {

    }
  
    create() {
      // Append the phaser canvas in the flex box
      $('.pocket__game').append($(this.game.canvas)); // Just this instance's canvas
      //$(this.game.canvas).draggable({containment: "parent"}); // Restrain to x-axis (also the div flex colum direction does this somehow)
      this.game.canvas.style.zIndex = 1;
      this.scene.start('controller');
    }
  
    update(time, delta) {

    }
  }  