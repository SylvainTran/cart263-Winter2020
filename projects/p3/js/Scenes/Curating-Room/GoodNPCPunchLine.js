class GoodNPCPunchLine extends Phaser.Scene {
    constructor() {
      super({key: 'GoodNPCPunchLine'});
      this.count = 0;
    }
  
    init() {
  
    }
  
    preload() {
      this.load.image("tilesA", "./assets/tilesets/tilesetA.png");
      this.load.tilemapTiledJSON("map", "./assets/tilemaps/world.json");
    }
  
    create() {
      let GoodNPCPunchLineData = {
        'theme': 'Good NPC Punch Line',
        'key': 'goodNPCPunchLine',
        'scene': 'GoodNPCPunchLine',
        'active': true,
        'input': 'choice'
      };
    }
  
    update(time, delta) {
  
    }
  }
  