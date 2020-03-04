"use strict";

/********************************************************************

Project 2: Something is wrong on the Internet
    Task spawner
        Creates capitalistic apertures on life
Sylvain Tran

// Dirt piles are random youtube videos
// Or any other tasks related to handling digital binging
// of any kind (e.g., facebook scrolling, instagram posting)

references:
Simon Penny's Stupid Robot (1985)
*********************************************************************/
const INTERVAL_NEW_TASK_SPAWN = 5000;

class YoutubeDirtPile extends Phaser.GameObjects.Image {

    constructor (scene, x, y)
    {
        super(scene, x, y, 'YoutubeDirtPile');

        this.setScale(1);
    }

}

class YoutubeDirtPilePlugin extends Phaser.Plugins.BasePlugin {

    constructor (pluginManager)
    {
        super(pluginManager);

        //  Register our new Game Object type
        pluginManager.registerGameObject('YoutubeDirtPile', this.createYoutubeDirtPile);
    }

    createYoutubeDirtPile (x, y)
    {
        return this.displayList.add(new YoutubeDirtPile(this.scene, x, y));
    }

}

//spawnDirt(scene)
//
//spawn dirty youtube videos for the robots to collect maybe
function spawnDirt(scene) {
    const DIRT_MULTIPLIER = 10;
    let NB_OF_DIRT_PILES = Math.floor(Math.random() * DIRT_MULTIPLIER);
    console.log(NB_OF_DIRT_PILES);
    let dirtyArray = Array(NB_OF_DIRT_PILES).fill(null).map( (x, i) => i );
    console.log(dirtyArray.length);

    dirtyArray.forEach((d) => {
        console.log("Spawning new Youtube Dirt Pile");
        let randomXY = [Math.random() * 480, Math.random() * 720];
        scene.add.YoutubeDirtPile(randomXY[0], randomXY[1]);
    });
}

function createNewYoutubeContent () {
    // Spawn new dirty and mindless youtube video for people to consume
    setTimeout(() => {
        //spawnDirt(game.scene.get(create));
    }, INTERVAL_NEW_TASK_SPAWN);
}