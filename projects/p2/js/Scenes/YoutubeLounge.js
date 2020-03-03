class YoutubeLounge extends Phaser.Scene {

    constructor () {
        super('YoutubeLounge');
    }

    init() 
    {      

    }
    
    preload () 
    {

    }

    create ()
    {
        this.testAutomata = new Automata({scene:this, x: automataConfig.x, y: automataConfig.y});
        this.testAutomata.speak();
        console.log("In youtube lounge");

        // TODO parallel launching with UI
        this.scene.launch("UI");
    }

    update(time, delta) 
    {
        this.testAutomata.AutomataFSM.step();
    }
}