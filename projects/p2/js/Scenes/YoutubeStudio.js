class YoutubeStudio extends Phaser.Scene {

    constructor () {
        super('youtubeStudio');
    }

    init(data)
    {
      //this.youtubePimpPlayer = data.player;
      this.rpgCommands = {
        'Give me :amount of loot': (lootValue) => {
            givePlayerLoot(lootValue);
        }
      }
      this.youtubeCommands = {
        'Create videos that make money': () => {
          // if has enough incentive/money bags, will create a suspicious video
          // otherwise will create art or something
          this.workCommandIssued = true;
          let alignment = checkIfEnoughMoney();
          createNewYoutubeContent(alignment);
          responsiveVoice.speak("New Content Uploaded.", "UK English Female", options);
          setTimeout(()=> {this.workCommandIssued = false; }, 1000); // Reset the state after 1 sec
        }
      };
      annyang.addCommands(this.rpgCommands);
      annyang.addCommands(this.youtubeCommands);

      //For more complex interactions later
      this.workCommandIssued = false;
    }

    preload()
    {

    }

    create ()
    {
        // Tilemap setup
        const youtubeStudioMap = this.make.tilemap({ key: "youtubeStudioMap" });
        const tileset = youtubeStudioMap.addTilesetImage("tilesetA", "tilesA");
        const belowLayer = youtubeStudioMap.createStaticLayer("Below", tileset, 0, 0);
        const worldLayer = youtubeStudioMap.createStaticLayer("World", tileset, 0, 0);
        const aboveLayer = youtubeStudioMap.createStaticLayer("Above", tileset, 0, 0);
        worldLayer.setCollisionByProperty({ collides: true });
        aboveLayer.setCollisionByProperty({ collides: true });

        // Collision debug
        const debugGraphics = this.add.graphics().setAlpha(0.75);
        aboveLayer.renderDebug(debugGraphics, {
          tileColor: null, // Color of non-colliding tiles
          collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
          faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });
        worldLayer.renderDebug(debugGraphics, {
          tileColor: null, // Color of non-colliding tiles
          collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
          faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });

        // Physics bounds
        this.physics.world.setBounds(0, 0, 320, 320);

        // Player collision with tiles with collide true
        // Spawn at the spawn point setup in Tiled
        const spawnPoint = youtubeStudioMap.findObject("GameObjects", obj => obj.name === "Spaw"); // TODO fix spawn point name in Tiled

        // TODO make player persistent in data object passed down
        // Sprite scale factor
        const scaleFactor = 0.3;
        this.youtubePimpPlayer = new YoutubePimpPlayer(this, spawnPoint.x, spawnPoint.y, "ley").setScale(scaleFactor);
        this.youtubePimpPlayer.setCollideWorldBounds(true);
        this.physics.add.collider(this.youtubePimpPlayer, aboveLayer);
        this.physics.add.collider(this.youtubePimpPlayer, worldLayer);

        // Camera follow and zoom
        this.cameras.main.setSize(640, 640);
        this.cameras.main.setBounds(0, 0, 320, 320);
        this.cameras.main.startFollow(this.youtubePimpPlayer, true, 0.05, 0.05);
        this.cameras.main.setZoom(3);

        // Test NPC
        const keenerAPosX = 169;
        const keenerAPosY = 102;
        this.youtubeCreatorKeenerA = new Automata(this, keenerAPosX, keenerAPosY, "ley").setScale(scaleFactor);
        this.youtubeCreatorKeenerA.speak();
        this.physics.add.collider(this.youtubePimpPlayer, this.youtubeCreatorKeenerA);

        $('.side__left-menu__top').text("IN THE STUDIO");
        let instructions = "Magic Spells: ";
        let spellA = " [Give me (desired amount) of loot]";
        let spellB = " [Create videos that make money]";
        // Update the main__log div to reflect the commands that we have
        $('.main__log').text(`${instructions}` + `${spellA}` + `${spellB}`);

        // TODO Launch Youtube channels if player activates the youtube channels in the studio
        //this.scene.launch("YoutubeChannelA");
    }

    update(time, delta)
    {
      console.log(this.youtubePimpPlayer.x);
      console.log(this.youtubePimpPlayer.y);
      this.youtubeCreatorKeenerA.AutomataFSM.step();
      this.youtubePimpPlayer.PlayerFSM.step();
    }
}
