class YoutubeLounge extends Phaser.Scene {

    constructor () {
        super('YoutubeLounge');
    }

    init(data) 
    {

    }
    
    preload () 
    {

    }

    create (data)
    {
        let testAutomata = new Automata({scene:this, x: automataConfig.x, y: automataConfig.y});
        testAutomata.speak();
        console.log("In youtube lounge");
        // TODO parallel launching with UI
        this.scene.launch("UI");
    }

    update(time, delta) 
    {

    }
}