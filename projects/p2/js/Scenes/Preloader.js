class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  init() {

  }

  preload() {
    this.load.image("automata", "./assets/images/automata.png");
    this.load.image("YoutubeDirtPile", "./assets/images/sprites/YoutubeDirtPile.png");
    this.load.atlas('ley', './assets/images/spritesheets/ley/leySpritesheet.png', './assets/images/spritesheets/ley/walk/leySpritesheet.json');
    // Tileset and maps
    this.load.image("tilesA", "./assets/tilesets/tilesetA.png");
    this.load.tilemapTiledJSON("map", "./assets/tilemaps/world-of-youtube.json");
    this.load.tilemapTiledJSON("youtubeStudioMap", "./assets/tilemaps/dank-youtube-studio.json");
  }

  create() {
    //Animations
    this.anims.create({ // This works
      key: 'everything',
      frames: this.anims.generateFrameNames('ley'), repeat: -1
    });
    this.anims.create({ 
      key: 'ley-left-walk',
      frames: this.anims.generateFrameNames('ley', {
        prefix: "walk000",
        suffix: ".png",
        frames: [3,4]
      }),
      frameRate: 5
    });
    this.anims.create({ 
      key: 'ley-right-walk',
      frames: this.anims.generateFrameNames('ley', {
        prefix: "walk000",
        suffix: ".png",
        frames: [5,6]
      }),
      frameRate: 5
    });
    this.anims.create({ 
      key: 'ley-up-walk',
      frames: this.anims.generateFrameNames('ley', {
        prefix: "walk000",
        suffix: ".png",
        frames: [7,8]
      }),
      frameRate: 5
    });
    this.anims.create({ 
      key: 'ley-front-walk',
      frames: this.anims.generateFrameNames('ley', {
        prefix: "walk000",
        suffix: ".png",
        frames: [1,2]
      }),
      frameRate: 5
    });
    this.scene.start('YoutubeLounge');
  }

  update(time, delta) {

  }
}
