class BootScene extends Phaser.Scene {

    constructor () {
        super({
            key: 'boot',
            files: [
                { type: 'image', key: 'bar', url: 'loaderBar.png' },
                { type: 'image', key: 'bg', url: 'background.png' },
            ]
        });
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
        let camera = this.cameras.add(0, 0, 1280, 760);
        this.youtubePimpPlayer = new YoutubePimpPlayer(this, 150, 150, "automata");
        this.youtubePimpPlayer.setCollideWorldBounds(true);
        
        // Voice control
        if(annyang)
        {
            // inits the commands
            annyang.init(commands, true);
            // Add our commands to annyang (separated for clarity)
            annyang.addCommands(commands);
            // Start listening
            annyang.start();
        }
        // Append the phaser canvas in the flex box
        $('.main__game').append($('canvas'));

        // Call first game scene in parallel (for now)
        this.scene.launch('YoutubeLounge');
    }

    update(time, delta) 
    {
        this.youtubePimpPlayer.PlayerFSM.step();
    }
}