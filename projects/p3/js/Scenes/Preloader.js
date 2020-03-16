class Preloader extends Phaser.Scene {
    constructor() {
      super('preloader');
    }
  
    init() {
  
    }
  
    preload() {
      this.load.image("tilesA", "./assets/tilesets/tilesetA.png");
      this.load.tilemapTiledJSON("map", "./assets/tilemaps/world.json");
    }
  
    create() {
      this.scene.start('World');
    }
  
    update(time, delta) {
  
    }
  }
  