class YoutubeStudio extends Phaser.Scene {

  constructor() {
    super('youtubeStudio');
  }

  init(data) {
    // Sprite scale factor
    this.scaleFactor = 0.3;
    // Test NPC called the YoutubeKeenerA. These are people who are keen to post on youtube to make $$$. This is linked to the theme of Jame Bridle's essay
    this.keenerAPosX = 169;
    this.keenerAPosY = 102;
    this.youtubeCreatorKeenerA;
    // Currently some issue with using the previous scene's player through the data object -- something to do with the FSM
    //this.youtubePimpPlayer = data.player;
    this.youtubePimpPlayer;
    // Our annyang commands for use inside the YoutubeStudio map
    this.rpgCommands = {
      // The player can ask for infinite amounts of money to come out of the sky -- this is for the player to reflect upon
      'Give me :lootValue': (lootValue) => {
        responsiveVoice.speak("Loot generated.", "UK English Female", options);
        givePlayerLoot(this.youtubePimpPlayer, lootValue);
      }
    }
    // These commands have to do with the player's wizard status
    // as the grand Youtube creator and lord so that they can ask
    // Keener youtubers to create content, which depends on the status of their bank account
    this.youtubeCommands = {
      'Create videos that make money': () => {
        // if has enough incentive/money bags, will create a suspicious video
        // otherwise will create art or something more positive/meaningful - not fully implemented yet
        this.workCommandIssued = true;
        // The agent's alignment is whether or not you are happy with your bank account, driving your
        // decision to make kinds of content on youtube
        let alignment = this.youtubeCreatorKeenerA.checkBankAccount();
        createNewYoutubeContent(this, alignment);
        responsiveVoice.speak("New Content Uploaded.", "UK English Female", options);
        setTimeout(() => {
          this.workCommandIssued = false;
        }, 1000); // Reset the state after 1 sec -- does not do anything yet
      }
    };
    annyang.addCommands(this.rpgCommands);
    annyang.addCommands(this.youtubeCommands);

    //For more complex interactions later
    this.workCommandIssued = false;
  }

  preload() {

  }

  create() {
    // Tilemap setup
    const youtubeStudioMap = this.make.tilemap({
      key: "youtubeStudioMap"
    });
    const tileset = youtubeStudioMap.addTilesetImage("tilesetA", "tilesA");
    const belowLayer = youtubeStudioMap.createStaticLayer("Below", tileset, 0, 0);
    const worldLayer = youtubeStudioMap.createStaticLayer("World", tileset, 0, 0);
    const aboveLayer = youtubeStudioMap.createStaticLayer("Above", tileset, 0, 0);
    // Player will also collide on elements of the world, like chests and NPCs -- fleshing this into a proper RPG in perhaps a decade
    worldLayer.setCollisionByProperty({
      collides: true
    });
    aboveLayer.setCollisionByProperty({
      collides: true
    });

    //Collision debug -- leaving it for debug purposes
    // const debugGraphics = this.add.graphics().setAlpha(0.75);
    // aboveLayer.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    // });
    // worldLayer.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    // });

    // Physics bounds
    this.physics.world.setBounds(0, 0, 320, 320);

    // Spawn at the spawn point setup in Tiled
    const spawnPoint = youtubeStudioMap.findObject("GameObjects", obj => obj.name === "Spaw"); // TODO fix spawn point name in Tiled

    // TODO make player persistent in data object passed down.. For now a player is generated again because there is no progression
    // in the game yet. Spawns at the spawnpoint set inside the Tiled editor
    this.youtubePimpPlayer = new YoutubePimpPlayer(this, spawnPoint.x, spawnPoint.y, "ley").setScale(this.scaleFactor);
    const newBoundBoxX = 43;
    const newBoundBoxY = 46;
    const boundBoxOffsetX = 9.5;
    const boundBoxOffsetY = 8;
    this.youtubePimpPlayer.setSize(newBoundBoxX, newBoundBoxY);
    this.youtubePimpPlayer.setOffset(boundBoxOffsetX, boundBoxOffsetY);
    this.youtubePimpPlayer.setCollideWorldBounds(true);
    // Player collision with tiles with collide true
    this.physics.add.collider(this.youtubePimpPlayer, aboveLayer);
    this.physics.add.collider(this.youtubePimpPlayer, worldLayer);

    // Camera follow and zoom
    this.cameras.main.setSize(640, 640);
    this.cameras.main.setBounds(0, 0, 320, 320);
    this.cameras.main.startFollow(this.youtubePimpPlayer, true, 0.05, 0.05);
    this.cameras.main.setZoom(3);

    // The One NPC
    this.youtubeCreatorKeenerA = new Automata(this, this.keenerAPosX, this.keenerAPosY, "ley").setScale(this.scaleFactor);
    this.youtubeCreatorKeenerA.speak();
    // Collision with the one NPC
    this.youtubeCreatorKeenerA.setCollideWorldBounds(true); 
    this.physics.add.collider(this.youtubeCreatorKeenerA, aboveLayer);
    this.physics.add.collider(this.youtubeCreatorKeenerA, worldLayer);
    this.physics.add.collider(this.youtubeCreatorKeenerA, this.youtubePimpPlayer);

    // Management of the UI outside the game canvas
    // Update the main__log div to reflect the commands that we have
    $('.main__log').text("...Finished loading the spellbook.");

    let newDivInstructions = document.createElement("DIV");
    let instructions = "<br>" + "<br>" + "Magic Spells: " + "<br>" + "<br>";
    let spellA = "<span style=\"color: yellow\">" + " [Give me (*cash value)]" + "</span>";
    let spellB = "<span style=\"color: green\">" + "[Create videos that make money]" + "</span>" + "<br>" + "<br>";
    $(newDivInstructions).append(instructions);
    $(newDivInstructions).append(spellB);
    $(newDivInstructions).append(spellA);
    $('.main__log').append(newDivInstructions);

    // TODO Launch Youtube channels if player activates the youtube channels in the studio
    //this.scene.launch("YoutubeChannelA");
  }

  update(time, delta) {
    this.youtubeCreatorKeenerA.AutomataFSM.step();
    this.youtubePimpPlayer.PlayerFSM.step();
  }
}