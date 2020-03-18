class CriticalHit extends Phaser.Scene {
    constructor() {
      super({key: 'CriticalHit'});
      this.count = 0;
    }
  
    init() {
  
    }
  
    preload() {
      this.load.image("tilesA", "./assets/tilesets/tilesetA.png");
      this.load.tilemapTiledJSON("map", "./assets/tilemaps/world.json");
    }
  
    create() {

    }
  
    update(time, delta) {
  
    }
  }