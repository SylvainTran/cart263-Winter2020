class StartMenu extends Phaser.Scene {
    constructor() {
      super('StartMenu');
    }
  
    init() {

    }
  
    preload() {

    }
  
    create() { 
      this.startMenuTheme = this.sound.add('startMenuTheme');      
      this.startMenuTheme.play();
      this.startMenuTheme.setLoop(true);
      // Creates the DOM start menu
      this.startMenu = this.add.dom().createFromCache('startMenu');
      this.tutorialMenu = this.add.dom().createFromCache('tutorialMenu');
      this.aboutMenu = this.add.dom().createFromCache('aboutMenu');        
      this.startMenu.setVisible(true);
      this.startMenu.setPosition(320, 640);
      this.tutorialMenu.setPosition(320, 640);
      this.tutorialMenu.setVisible(false);
      this.aboutMenu.setPosition(320, 640);
      this.aboutMenu.setVisible(false);
      // Add click event listeners to handle the menu
      $('#menu--start').click(() => {
        this.startMenuTheme.stop();
        this.scene.start('Controller');         
      });
      $('#menu--tutorial').click(() => {
        // Set it visible
        this.tutorialMenu .setVisible(true);
      });
      $('#menu--about').click(() => {
        this.aboutMenu.setVisible(true);
      });      
      $('#menu--tutorialStartMenu, #menu--aboutStartMenu').click(() => {
        this.tutorialMenu.setVisible(false);
        this.aboutMenu.setVisible(false);
      });
    }
}