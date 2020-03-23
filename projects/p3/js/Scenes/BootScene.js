class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'boot'
    });
  }

  init() {

  }

  preload() {
    this.load.image("tilesA", "./assets/tilesets/tilesetA.png");
    this.load.tilemapTiledJSON("map", "./assets/tilemaps/world.json");
  }

  create() {
    this.scene.start('Controller');
  }

  update(time, delta) {

  }
}