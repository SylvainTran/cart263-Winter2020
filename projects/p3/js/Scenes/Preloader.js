class Preloader extends Phaser.Scene {
  constructor() {
    super({
      key: 'preloader'
    });
  }

  preload() {
    this.load.atlas('hero', './assets/images/spritesheets/hero/walk/heroSpriteSheet.png', './assets/images/spritesheets/hero/walk/heroSpriteSheet.json');
    this.valueBarTrack = this.load.image("valueBarTrack", "./assets/images/ui/valueBarTrack.psd");
    this.valueBarImg = this.load.image("valueBarImg", "./assets/images/ui/valueBar.psd");
    this.load.audio('zap', ['assets/sounds/PLAYER_CREATED.ogg']);
    this.load.audio('ui-poing', ['assets/sounds/ui/poing.ogg']);
    this.load.audio('linkButton', ['assets/sounds/ui/linkButton.wav']);
    this.load.audio('sceneEnter', ['assets/sounds/SCENE_ENTER.wav']);
    this.load.audio('pianoTheme', ['assets/sounds/PIANO_THEME.mp3',
                                   'assets/sounds/PIANO_THEME.ogg']);
    this.load.audio('footstepDirt', ['assets/sounds/FOOTSTEP_DIRT.mp3',
                                      'assets/sounds/FOOTSTEP_DIRT.wav']);       
    this.load.audio('footstepWater', ['assets/sounds/FOOTSTEP_WATER.mp3',
                                   'assets/sounds/FOOTSTEP_WATER.wav']);    
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