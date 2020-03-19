class BootScene extends Phaser.Scene {
    constructor() {
      super({key: 'boot'});
    }
  
    init() {
  
    }
  
    preload() {
      this.load.image("tilesA", "./assets/tilesets/tilesetA.png");
      this.load.tilemapTiledJSON("map", "./assets/tilemaps/world.json");
    }
  
    create() {
      //$(this.game.canvas).draggable({containment: "parent"}); // Restrain to x-axis (also the div flex colum direction does this somehow)
      //this.game.canvas.style.zIndex = 1;
      this.scene.start('Controller');
    }
  
    update(time, delta) {

    }
  }  