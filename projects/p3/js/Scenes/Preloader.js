class Preloader extends Phaser.Scene {
  constructor() {
    super({key: 'preloader'});
  }

  init() {
    // From Phaser WebFont example
    let element = document.createElement('style');
    document.head.appendChild(element);
    let sheet = element.sheet;
    let styles = '@font-face { font-family: "Press Start 2P"; }';
    sheet.insertRule(styles, 0);
  }

  preload() {
    // Player sprite
    this.load.atlas('hero', './assets/images/spritesheets/hero/walk/heroSpriteSheet.png', './assets/images/spritesheets/hero/walk/heroSpriteSheet.json');
    // Actors sprites
    this.load.image('p_001', 'assets/images/sprites/actors/persons/actors_person_fishman_A_single.png');
    this.load.image('i_001', 'assets/images/sprites/actors/inanimate/actors_inanimate_rock_A_single.png');
    this.load.image('questionnaireBoss', 'assets/images/sprites/actors/persons/QuestionnaireBoss.png');
    // Mind space form sprite
    this.load.image('mindSpaceForm', 'assets/images/sprites/mindSpaceForm.png');
    // UI
    this.valueBarTrack = this.load.image("valueBarTrack", "./assets/images/ui/valueBarTrack.psd");
    this.valueBarImg = this.load.image("valueBarImg", "./assets/images/ui/valueBar.psd");
    // Sound effects
    this.load.audio('zap', ['assets/sounds/PLAYER_CREATED.ogg']);
    this.load.audio('ui-poing', ['assets/sounds/ui/poing.ogg']);
    this.load.audio('linkButton', ['assets/sounds/ui/linkButton.wav']);
    this.load.audio('sceneEnter', ['assets/sounds/SCENE_ENTER.wav']);
    // Themes
    this.load.audio('startMenuTheme', ['assets/sounds/ADVENTURE_BEGINS-8-BIT.ogg']);
    this.load.audio('mainTheme', ['assets/sounds/MAIN_THEME.mp3']);
    this.load.audio('pianoTheme', ['assets/sounds/PIANO_THEME.mp3',                                   'assets/sounds/PIANO_THEME.ogg']);
    // Footstep sounds                                  
    this.load.audio('footstepDirt', ['assets/sounds/FOOTSTEP_DIRT.mp3',
                                      'assets/sounds/FOOTSTEP_DIRT.wav']);       
    this.load.audio('footstepWater', ['assets/sounds/FOOTSTEP_WATER.mp3',
          'assets/sounds/FOOTSTEP_WATER.wav']);    
    // Data JSON files
    // Narrative
    this.load.json('chapters', 'assets/data/dialogues.json');  
    // Mind spaces
    this.load.json('mindSpaces', 'assets/data/mindSpaces.json');
    // Tileset (game world in black and white)
    this.load.image("16x16-1bit", "assets/tilesets/16x16-1bit.png");    
    // Tilemap json (game world)
    this.load.tilemapTiledJSON("world", "assets/tilemaps/world.json"); 
    // Questionnaire forms
    this.load.html('agreeForm', 'assets/forms/agreeForm.html');   
    // Progress tab menu
    this.load.html('progressTabMenu', 'assets/menus/progressTabMenu.html');    
    // Start menu
    this.load.html('startMenu', 'assets/menus/startMenu.html');    
    // Tutorial menu
    this.load.html('tutorialMenu', 'assets/menus/tutorialMenu.html');    
    // About menu
    this.load.html('aboutMenu', 'assets/menus/aboutMenu.html');    
    // The action icon for dialogue boxes
    this.load.image('nextPage', 'assets/images/icons/mousePointer.png');                 
    // Fonts
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    // HUD
    this.load.html('hud', 'assets/hud.html');
    // Court seance screen
    this.load.html('courtSeance', 'assets/courtSeance.html');
  }

  create() {
    WebFont.load({
      custom: {
        families: ['Press Start 2P']
      }
    });
    // Animations
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
    this.debugMode = false; 
    if(!this.debugMode) {     
      this.scene.start('StartMenu');    
    } else {
      this.scene.start('Controller');
      this.scene.start('World'); 
      this.scene.start('UI');
      this.scene.start('Hud');          
    }
  }
}