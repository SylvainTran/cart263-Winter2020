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

    init(data) 
    {
        // states
        let automataStates = 
        {
            idle: new IdleState(),
            laboring: new LaboringState(),
            exhausted: new ExhaustedState()
        }

        let playerStates = 
        {
            idle: new PlayerIdleState(),
            moving: new MovingState()
        }
        // fsm
        this.AutomataFSM = new StateMachine('idle', automataStates, [this, this.player]);
        this.PlayerFSM = new StateMachine('idle', playerStates, [this, this.player]);
    }
    
    preload () 
    {
        this.load.image("automata", "./assets/images/automata.png");
        this.load.image('YoutubeDirtPile', "./assets/images/sprites/YoutubeDirtPile.png");
    }

    create (data)
    {
        let camera = this.cameras.add(0, 0, 1280, 760);
        player = this.physics.add.sprite(400, 0, "automata");
        player.setCollideWorldBounds(true);
        automatons = this.physics.add.group();
        automatons.enableBody = true;
        automatons.physicsBodyType = Phaser.Physics.ARCADE;

        for(let i = 0; i < NB_AUTOMATA; i++)
        {
            let a = automatons.create(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 'automata');
            //a.body.immovable = true;
        }
        // Add event listeners    
        this.physics.add.collider(player, automatons);
        this.physics.add.collider(automatons, automatons);
        this.physics.add.collider(player, automatons, rotateMe, null, this);
        cursors = this.input.keyboard.createCursorKeys();

        // Animate each automaton
        setInterval(() => { automatons.getChildren().forEach(automata => {
            automatons.rotate(Math.PI/8); // 2, 25, 50, 200  
        });}, 1000);

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
        this.AutomataFSM.step();
        this.PlayerFSM.step();  
    }
}