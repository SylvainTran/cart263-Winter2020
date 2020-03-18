class Controller extends Phaser.Scene {
    constructor() {
      super({key: 'controller'});
      this.count = 0;
    }
  
    init() {
  
    }
  
    preload() {
      this.load.image("tilesA", "./assets/tilesets/tilesetA.png");
      this.load.tilemapTiledJSON("map", "./assets/tilemaps/world.json");
    }
  
    create() {
      // Create the main canvas that will hold other pocket games     
      this.createMainCanvas(true);
      // Add the other scenes
      this.scene.add('CriticalHit', CriticalHit, true);
      this.scene.add('GoodNPCPunchLine', GoodNPCPunchLine, true);
      this.scene.add('RareLoot', RareLoot, true);
      

      this.scene.start('mainCanvasWorld');
    }
  
    createMainCanvas(addToActiveDisplay) {
      let mainCanvasWorld = new World('mainCanvasWorld');
      this.scene.add('mainCanvasWorld', mainCanvasWorld, addToActiveDisplay);
      console.log("Added main canvas world.");
    }

    update(time, delta) {
  
    }
  }
  