class Preloader extends Phaser.Scene {

    constructor () {
        super('preloader');
    }

    init() 
    {

    }
    
    preload () 
    {
        this.load.image("automata", "./assets/images/automata.png");
        this.load.image('YoutubeDirtPile', "./assets/images/sprites/YoutubeDirtPile.png");
    }

    create ()
    {
        this.scene.start('YoutubeLounge');
    }

    update(time, delta) 
    {

    }
}