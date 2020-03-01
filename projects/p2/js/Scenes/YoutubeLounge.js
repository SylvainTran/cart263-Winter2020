class YoutubeLounge extends Phaser.Scene {

    constructor () {
        super({
            key: 'YoutubeLounge'
        });
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
    }

    update(time, delta) 
    {

    }
}