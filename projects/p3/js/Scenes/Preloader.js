class Preloader extends Phaser.Scene {
  constructor() {
    super({
      key: 'preloader'
    });
  }

  preload() {
    this.load.atlas('hero', './assets/images/spritesheets/hero/walk/heroSpriteSheet.png', './assets/images/spritesheets/hero/walk/heroSpriteSheet.json');
  }

  create() {
    //Animations
    this.anims.create({ 
      key: 'everything',
      frames: this.anims.generateFrameNames('hero'), repeat: -1
    });
    this.anims.create({ 
      key: 'player-left-walk',
      frames: this.anims.generateFrameNames('hero', {
        prefix: "walk000",
        suffix: ".png",
        frames: [3,4]
      }),
      frameRate: 5
    });
    this.anims.create({ 
      key: 'player-right-walk',
      frames: this.anims.generateFrameNames('hero', {
        prefix: "walk000",
        suffix: ".png",
        frames: [5,6]
      }),
      frameRate: 5
    });
    this.anims.create({ 
      key: 'player-up-walk',
      frames: this.anims.generateFrameNames('hero', {
        prefix: "walk000",
        suffix: ".png",
        frames: [7,8]
      }),
      frameRate: 5
    });
    this.anims.create({ 
      key: 'player-front-walk',
      frames: this.anims.generateFrameNames('hero', {
        prefix: "walk000",
        suffix: ".png",
        frames: [1,2]
      }),
      frameRate: 5
    });    
    this.scene.start('Controller');
  }
}