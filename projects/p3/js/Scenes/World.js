class World extends Phaser.Scene {

    constructor() {
      super('World');
    }
  
    init(data) {
  
    }
  
    preload() {
  
    }
  
    create() {
      const map = this.make.tilemap({
        key: "map"
      });
      // Create the tileset from the map, using our preloaded assets
      const tileset = map.addTilesetImage("tilesetA", "tilesA");
      // Assign the layers using definitions inside the Tiled editor
      const belowLayer = map.createStaticLayer("Below", tileset, 0, 0);
      const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
      const aboveLayer = map.createStaticLayer("Above", tileset, 0, 0);
      // Collide with the above player as defined in the Tiled editor
      aboveLayer.setCollisionByProperty({
        collides: true
      });
      // Spawn at the spawn point setup in Tiled
      const spawnPoint = map.findObject("GameObjects", obj => obj.name === "Spawn Point");
      // Physics bounds
      this.physics.world.setBounds(0, 0, 160, 160);
      // Camera follow and zoom
      this.cameras.main.setSize(160, 160);
      this.cameras.main.setBounds(0, 0, 160, 160);
      //this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
      this.cameras.main.setZoom(2);
    }
  
    update(time, delta) {

    }
  }