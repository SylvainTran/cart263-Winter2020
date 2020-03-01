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

$(document).ready(setup);

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

function setup() 
{
    // setInterval(() => {
    //     spawnDirt();
    // }, INTERVAL_NEW_TASK_SPAWN);
}

// function spawnDirt() {
//     let NB_OF_DIRT_PILES = Math.random();
//     let dirtyArray = [NB_OF_DIRT_PILES];
//     let randomXY = [Math.random() * 480, Math.random() * 720];

//     dirtyArray.forEach((d) => {
//         console.log("spawning new dirt pile");
//         this.add.YoutubeDirtPile(randomXY);
//     })
// }