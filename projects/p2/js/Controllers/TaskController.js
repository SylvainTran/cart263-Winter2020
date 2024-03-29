"use strict";

/********************************************************************

Project 2: Something is wrong on the Internet
    Task spawner
        Creates capitalistic apertures on life
Sylvain Tran

// Dirt piles are random youtube videos
// Or any other tasks related to handling digital binging
// of any kind (e.g., facebook scrolling, instagram posting) <-- not implemented yet

references:
Simon Penny's Stupid Robot (1985)
*********************************************************************/
// Interval for spawning new dirt or good videos
const INTERVAL_NEW_TASK_SPAWN = 5000;

//YoutubeDirtPile
//
//Custom image plugin for now, perhaps will be more impactful later
class YoutubeDirtPile extends Phaser.GameObjects.Image {

  constructor(scene, x, y) {
    super(scene, x, y, 'YoutubeDirtPile');

    this.setScale(1);
  }

}
//YoutubeDirtPilePlugin
//
//The plugin itself for Phaser
class YoutubeDirtPilePlugin extends Phaser.Plugins.BasePlugin {

  constructor(pluginManager) {
    super(pluginManager);

    //  Register our new Game Object type
    pluginManager.registerGameObject('YoutubeDirtPile', this.createYoutubeDirtPile);
  }
  // createYoutubeDirtPile
  //
  // To make it easy to call within scenes
  createYoutubeDirtPile(x, y) {
    return this.displayList.add(new YoutubeDirtPile(this.scene, x, y));
  }

}

//createNewYoutubeContent(scene, alignment)
//
//Creates new youtube content depending on being low on cash or not
function createNewYoutubeContent(scene, alignment) {
  // Spawn new dirty and mindless youtube video for people to consume if alignment is false (wrong) <- that is, when money is an issue for the artist/content creator
  setTimeout(() => {
    if (alignment === true) { // word play on true; means that you're O-K to create good content
      spawnGoodVideo(scene);
    } else {
      spawnDirt(scene);
    }
  }, INTERVAL_NEW_TASK_SPAWN);
}

//spawnDirt(scene)
//
//spawn dirty youtube videos
function spawnDirt(scene) {
  const DIRT_MULTIPLIER = 10;
  let NB_OF_DIRT_PILES = Math.floor(Math.random() * DIRT_MULTIPLIER);
  let dirtyArray = Array(NB_OF_DIRT_PILES).fill(null).map((x, i) => i);
  // Adds the youtube dirt piles and also the actual embedded youtube videos in the HTML outside the game canvas. Sometimes this does not work for server issues, in which case a gray video will appear
  dirtyArray.forEach((d) => {
    // Random image in the game -- Will probably be changed to something more impactful later, like giving an object to the player
    let randomXY = [Math.random() * 640, Math.random() * 640];
    scene.add.YoutubeDirtPile(randomXY[0], randomXY[1]);
    // Selecting the video in the arrays that contain our video urls
    let randomVideoIndex = Math.floor(Math.random() * dirtyVideosUrls.length);
    let dirtyVideoElected = dirtyVideosUrls[randomVideoIndex];
    // Creating the div and giving the attribute to the iframe that will contain the src of the url of the dirty video
    let newDiv = document.createElement("DIV");
    let videoDiv = document.createElement("iframe");
    $(videoDiv).addClass("flex-row-divs");
    $(videoDiv).attr("width", 420);
    $(videoDiv).attr("height", 315);
    $(videoDiv).attr("src", dirtyVideoElected.replace("watch?v=", "embed/"));
    // Append it in the HTML
    newDiv.appendChild(videoDiv);
    $('#youtubeVideos').append(newDiv);
  });
}

//spawnGoodVideo(scene)
//
//spawn good youtube videos
function spawnGoodVideo(scene) {
    const GOOD_VIDEO_MULTIPLIER = 10;
    let NB_OF_GOOD_PILES = Math.floor(Math.random() * GOOD_VIDEO_MULTIPLIER);
    console.log(NB_OF_GOOD_PILES);
    let goodArray = Array(NB_OF_GOOD_PILES).fill(null).map( (x, i) => i );
    console.log(goodArray.length);

    goodArray.forEach((d) => {
        console.log("Spawning new Youtube Good Video");
        let randomXY = [Math.random() * 640, Math.random() * 640];
        // TODO use Youtube's API or trick to spawn something like it
        scene.add.YoutubeDirtPile(randomXY[0], randomXY[1]);
        let randomVideoIndex = Math.floor(Math.random() * goodVideoUrls.length);
        let goodVideoElected = goodVideoUrls[randomVideoIndex];
        let newDiv = document.createElement("DIV");
        let videoDiv = document.createElement("iframe");
        $(videoDiv).addClass("flex-row-divs");
        $(videoDiv).attr("width",420);
        $(videoDiv).attr("height", 315);
        $(videoDiv).attr("src", goodVideoElected.replace("watch?v=", "embed/"));
        newDiv.appendChild(videoDiv);
        $('#youtubeVideos').append(newDiv);  
    });
}

// Videos that fit James Bridle's disturbed video content category. May give a gray box instead for server problem reasons
let dirtyVideosUrls = [
  "https://www.youtube.com/watch?v=Or8iYWRg2w8",
  "https://www.youtube.com/watch?v=DTSWQGKUg_c",
  "https://www.youtube.com/watch?v=2hizjTNsOCo", // This one is extremely disturbing and should not be watched under any circumstances
  "https://www.youtube.com/watch?v=_iJM-4YNs6k"
];

// Good videos in my books. May give a gray box instead for server problem reasons
let goodVideoUrls = [
    "https://www.youtube.com/watch?v=owx3ao42kwI",
    "https://www.youtube.com/watch?v=ouTrl07SIF8",
    "https://www.youtube.com/watch?v=AE_PZ4YyvHg",
    "https://www.youtube.com/watch?v=xeApql7zeSY"
];