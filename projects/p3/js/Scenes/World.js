/* World
//
// Single script World handling both view and game logic. Has mostly overriden the Controller.js script for now.
// What follows is the high level documentation for understanding this game's concepts:
//
// Description:
// The game plays in a sequence of two rounds. This is an abstraction on the
// previous iteration's "paired scenes" logic.
//
  // In Phase One, the player can explore the game world like in pre-existing J-RPGs
    // Actions are: Walking, Talking to npcs, and filling out questionnaires

  // In Phase Two, the player is locked in a court where the player's questionnaire answers are reviewed
    // Actions are: Reading dialogue, Choosing actor habitats
*/
class World extends Phaser.Scene {
  constructor(key, controller) {
    super('World');
    this.controller = null; // The controller for "pre-micro game version's" logic
    this.spawnPointA = null; // This micro game version's spawning point location
    this.globalPlayer = null; // The player residing in the World (global scene)
    this.aboveLayer = null; // The layer which has collision objects in it
    this.worldLayer = null; // The layer in which the player and characters can walk
    this.belowLayer = null; // The layer containing decors 
    this.areaConfig = null; // The config object for the state of actors in the game world
    this.currentAreaActors = null; // The current game area's actors
    this.currentArea = 0; // Area to start (first is at 0)
    this.questionnaireBoss = null; // The guy to drop in quests
    this.inPhase = null; // Current Phase the player is in (either phase 1 or 2)
    this.dialogueLock = false; // Whether the player is currently locked in a conversation thread to prevent mixing dialogue calls
  }
  // Grab the controller
  init() {
    this.controller = this.scene.manager.getScene('Controller');
  }
  // Setup anything required before starting the game
  create() {
    // Bring the UI scene to top
    this.scene.manager.bringToTop('UI');
    // Create the game world's tilemap
    this.setupWorldTiles();
    // Spawn at the spawn point setup in Tiled
    this.setupPlayerSpawningPoints();
    // Controller for the player in the main world
    this.createPlayer();
    // Setup actors at spawn points after getting the area config
    this.areaConfig = this.areaManager(this.currentArea);
    // Get the spawn points from the tilemap, by filtering through the Tiled layers
    this.areaConfig.actorSpawningPoints = this.worldTilemap.filterObjects("GameObjects", (obj) => obj.name.includes("actorSpawnPoint"));
    // Setup physics bounds
    this.setupActorPhysics();
    // Setup drag mechanics
    this.setupDrag();
    // Setup cameras
    this.setupCameras();
    // Setup text decor in the background
    this.addTextDecor();
    // Handleresizing event
    this.scale.on('resize', this.resize, this);
    // Fade effect
    this.cameraFadeEffect();
    // Get the local storage progression if there is one, or create it if not
    this.updateCurrentRoundQuestionnaires();
    // Update current phase in
    this.updateCurrentPhaseFlag();
    // Start the phase routines - This is the main game loop
    this.setupGamePhase();
    // Update initial UI
    updateProgressUI(this.getProgressionData());
    // Event handler setup
    // To handle change scene events without always checking for it in update()
    changeToPhaseTwoEmmitter = new Phaser.Events.EventEmitter();
    changeToPhaseTwoEmmitter.on('changePhase', this.setupPhaseTwoRoutine, this);
  }
  // update current phase flag for the UI
  updateCurrentPhaseFlag() {
    let currentProgression = this.getProgressionData();
    if (currentProgression.questionnairesAnswered >= currentProgression.currentRoundQuestionnaires - 1) {
      this.inPhase = 2;
    } else {
      this.inPhase = 1;
    }
  }
  // Fade in and out to make it look cool
  cameraFadeEffect() {
    this.cameras.main.fadeOut(1000);
    this.cameras.main.fadeIn(1000);
  }
  // Update the game logic and rendering
  update(time, delta) {
    // Check for collision events between the player and any actor
    if (this.currentAreaActors) {
      this.physics.world.collide(this.globalPlayer, this.currentAreaActors, this.startDialogue, null, this);
    }
  }
  // recreateWorld
  //
  // Recreate the game by restarting it and setting up its things
  recreateWorld() {
    this.cameraFadeEffect();
    // Reset the current round game data and destroy old actors
    this.resetGame();
    // Restart the scene so the current scene's display queue can be processed
    this.scene.restart();
  }
  // Set the current round's total needed questionnaires in localStorage
  updateCurrentRoundQuestionnaires() {
    let currentProgression = this.getProgressionData();
    let areaConfig = this.areaManager(this.currentArea);
    if (!currentProgression) {
      // Set it to the existing global one if was null, and update it      
      localStorage.setItem("gameProgression", JSON.stringify(gameProgression));
      currentProgression = this.getProgressionData();
      currentProgression.currentRoundQuestionnaires = areaConfig.nbQuestionnaires;
      // Set it in local storage now that it's not null
      localStorage.setItem("gameProgression", JSON.stringify(currentProgression));
      // We start in phase 1
      this.inPhase = 1;
    } else {
      currentProgression.currentRoundQuestionnaires = areaConfig.nbQuestionnaires;
      localStorage.setItem("gameProgression", JSON.stringify(currentProgression));
      this.inPhase = 1;
    }
  }
  // Get progression data saved in the localStorage
  getProgressionData() {
    return JSON.parse(localStorage.getItem("gameProgression"));
  }
  // Setup the two game phases (After deciding which one is the current phase)
  setupGamePhase() {
    // Show the current Phase player is in
    let UI = this.scene.manager.getScene('UI');
    let currentPhaseScreen = this.showCurrentPhaseFeedback(UI);
    // Destroy it after 3 seconds
    setTimeout(() => {
      currentPhaseScreen.destroy();
    }, 3000);
    // Phase one, still missing questionnaires
    if (this.inPhase === 1 && !this.checkPhaseOneEnded()) {
      this.setupPhaseOneRoutine();
      // Phase 2, finished questionnaires
    } else if (this.inPhase === 2 && this.checkPhaseOneEnded()) {
      this.setupPhaseTwoRoutine();
      // If not in a phase, and has not been assigned questionnaires yet, then in phase 1
    } else if (!this.inPhase && !this.getProgressionData().questionnairesAssignedYet && !this.checkPhaseOneEnded()) {
      this.setupPhaseOneRoutine();
      // If the player was assigned a questionnaire and phase one was ended
    } else if (!this.inPhase && this.getProgressionData().questionnairesAssignedYet && this.checkPhaseOneEnded()) {
      this.setupPhaseTwoRoutine();
      // If the court seance was over and were restarting
    } else if (!this.inPhase && this.getProgressionData().questionnairesAssignedYet && this.checkPhaseOneEnded() && this.courtSeanceCompleted) {
      this.recreateWorld();
      this.setupPhaseOneRoutine();
      // if the court seance was not over but were were in it, resume there
    } else if (!this.inPhase && this.getProgressionData().questionnairesAssignedYet && this.checkPhaseOneEnded() && !this.courtSeanceCompleted) {
      this.setupPhaseTwoRoutine();
    } else if (!this.inPhase && this.getProgressionData().questionnairesAssignedYet && !this.checkPhaseOneEnded) {
      this.setupPhaseOneRoutine();
    }
  }
  // Check if Phase one has ended yet
  checkPhaseOneEnded() {
    let currentProgression = JSON.parse(localStorage.getItem("gameProgression"));
    if (currentProgression) { // -1 to count correctly
      console.log("Questionnaires Answered: " + currentProgression.questionnairesAnswered);
      console.log("Questionnaires Total: " + currentProgression.currentRoundQuestionnaires);
      return currentProgression.questionnairesAnswered >= currentProgression.currentRoundQuestionnaires - 1;
    } else {
      return;
    }
  }
  // Setup phase one 
  setupPhaseOneRoutine() {
    // Player gets assigned actors and areas to explore for data
    // If has not gotten sets of questionnaire assigned yet, player is given one automatically (for now)
    // $Stretch: to go talk to the questionnaire boss to get them
    if (!this.getProgressionData().questionnairesAssignedYet) {
      this.inPhase = 1;
      this.updateActiveQuest(true);
    }
    // Update inPhase flag
    this.inPhase = 1;
    // this is the line of dialogues that the player can get
    let key = "prePhaseOne";
    let questPrompts = this.cache.json.get('chapters');
    // Grab a random dialogue node among the options for that type of dialogue
    let node = Math.floor(Math.random() * (questPrompts[0][key].length - 1));
    let dialogueData = questPrompts[0][key][node];
    this.displayDialogue(dialogueData);
    // $Stretch: The player should get assigned questionnaires once he meets with the questionnaire boss
    // Use the spawn pool with the World as context
    let spawnPool = this.spawnPool();
    spawnPool(this.areaConfig, this);
  }
  // Update whether the player got a questionnaire assignment yet in localStorage
  updateActiveQuest(value) {
    let currentProgression = this.getProgressionData();
    currentProgression.questionnairesAssignedYet = value;
    localStorage.setItem("gameProgression", JSON.stringify(currentProgression));
  }
  // Setup phase two
  setupPhaseTwoRoutine() {
    if (this.courtSeanceCompleted) {
      return;
    }
    // Update inPhase flag
    this.inPhase = 2;
    this.courtSeanceCompleted = true;
    // Fade effect
    this.cameraFadeEffect();
    // Show the current phase feedback to the player
    let UI = this.scene.manager.getScene('UI');
    let currentPhaseScreen = this.showCurrentPhaseFeedback(UI);
    // Destroy it after 3 seconds
    setTimeout(() => {
      currentPhaseScreen.destroy();
    }, 3000);

    // Set the player's sprite in a fixed tribunal room belonging to phase 2
    // this.scene.transition
    // let phaseTwoSpawnPoint = this.worldTilemap.filterObjects("GameObjects", (obj) => obj.name.includes("phaseTwoPlayerSpawnPoint"));
    // this.globalPlayer.setPosition(phaseTwoSpawnPoint.x, phaseTwoSpawnPoint.y);
    this.globalPlayer.setPosition(400, 100);
    // ?player.input.disabled
    // While we are in tribunal process, check every answer made by the player
    // get the last questionnaires answered by the player, arrays of questions by which a likert value was selected
    let currentProgression = this.getProgressionData();
    let peopleQuestionsLikertA = currentProgression.peopleQuestionsLikertA;
    let animalQuestionsLikertA = currentProgression.animalQuestionsLikertA;
    let inanimateQuestionsLikertA = currentProgression.inanimateQuestionsLikertA;
    // Calculate stats on likert scales (regex for pattern matching on integers 1-5)
    let scale = /[1-5]/;
    // Calculate the mean for each scale
    let meanPeopleQs = this.computeAverage(peopleQuestionsLikertA, scale);
    let meanAnimalsQs = this.computeAverage(animalQuestionsLikertA, scale);
    let meanInanimateQs = this.computeAverage(inanimateQuestionsLikertA, scale);
    let means = [meanPeopleQs, meanAnimalsQs, meanInanimateQs];
    let seance = [];
    seance = this.getMeans(seance, means);
    // Court Seance
    // Creates the screen from the DOM cache
    this.courtSeanceScreen = UI.add.dom().createFromCache('courtSeance');
    this.courtSeanceScreen.setVisible(true);
    this.courtSeanceScreen.setScale(0.5);
    this.courtSeanceScreen.setPosition(500, 320);
    this.enactCourtSeance(seance);

    // Phase 2 is over after every questionnaire was reviewed (or TODO user clicks the screen)
    setTimeout(() => {
      // Destroy the screen
      this.courtSeanceScreen.destroy();
      this.recreateWorld();
    }, 10000);
  }
  // showCurrentPhaseFeedback
  //
  // show the current phase to the player visually
  showCurrentPhaseFeedback(UI) {
    let currentPhaseScreen = UI.add.dom().createFromCache('currentPhaseScreen');
    let value;
    // If not in a phase currently (null) is phase 1 as well. Otherwise if the remainder is 0 then its Phase 2
    if (this.inPhase % 2 === 0) {
      value = 2;
    } else {
      value = 1;
    }
    let text = "Current Phase: " + value + "!";
    $('#menu--currentPhase').text(text);
    currentPhaseScreen.setVisible(true);
    currentPhaseScreen.setScale(0.75);
    currentPhaseScreen.setPosition(320, 110);
    return currentPhaseScreen;
  }
  // Enact the court seance phase
  enactCourtSeance(seance) {
    let text = "";
    if (seance[0] > 3) {
      // Player disagreed more than not on this chapter's topic
      // He is in favor/disfavor of a {TO BE DESIGNED} ruling over people of the previous chapter
      text = "You were in <span style=\"color: blue;\">DISFAVOR</span> for most claims.";
    } else if (seance[0] === 3) {
      // Player was neutral
      // He is not in favor of much regarding this chapter's topic, decision will be weighted randomly or by 
      // considering other bonus factors. Taking the remainder for now
      let randomFavor = Math.floor(Math.random(5, 10)) % 2;
      if (randomFavor > 0) {
        text = "You were in <span style=\"color: blue;\">FAVOR</span> for most claims.";
      } else {
        text = "You were <span style=\"color: blue;\">indifferent</span> to most claims."
      }
    } else if (seance[0] < 3) {
      // Player agreed more than not on this chapter's topic
      text = "You were in <span style=\"color: blue;\">FAVOR</span> for most claims.";
    } else {
      text = "You were indifferent to most claims.";
    }
    // $Stretch scope
    $('#seance--people').html(text);
    $('#seance--people').click(() => {});
    // More meaningful interactions in choices and simulation coming later
    // ...
  }
  // getMeans
  //
  // Get the all the averages in one array if they're actually numbers
  getMeans(array, means) {
    for (let i = 0; i < means.length; i++) {
      // For now inanimate and animals will pass on NaN because their means are NaN. They're not part of the game yet.
      if (means[i]) {
        array.push(means[i]);
      }
    }
    return array;
  }
  // computeAverage
  //
  // return the average of an array's values for likert scales matching
  computeAverage(array, scale) {
    return this.computeSum(array, scale) / array.length;
  }
  // computeSum
  //
  // compute the sum of string likert scales contained in arrays
  computeSum(array, scale) {
    let sum = 0;
    let arrayLength = array.length;
    for (let i = 0; i < arrayLength; i++) {
      let value = array[i].match(scale)[0];
      sum += parseInt(value);
    }
    return sum;
  }
  // Creates the actors in the game world depending on the area parameter
  // An area corresponds to a state of interactions in the game world
  areaManager(area) {
    let nbActors = 0;
    let actors = [];
    let nbQuestionnaires = 0;
    // The area parameter is the level progression
    // actor creation needs time, so for now they're all fishmen and rocks
    switch (area) {
      case 0:
        nbActors = 2;
        nbQuestionnaires = 2;
        actors = [FishMan, Rock];
        break;
      case 1:
        nbActors = 3;
        nbQuestionnaires = 3;
        actors = [FishMan, FishMan, Rock];
        break;
      case 2:
        nbActors = 4;
        nbQuestionnaires = 4;
        actors = [FishMan, FishMan, Rock, Rock];
        break;
      default:
        nbActors = 2;
        nbQuestionnaires = 2;
        actors = [FishMan, Rock];
        break;
    }
    // The area config to use for level handling
    const areaConfig = {
      nbActors: nbActors,
      nbQuestionnaires: nbQuestionnaires,
      actors: actors,
      actorSpawningPoints: undefined,
    };
    return areaConfig;
  }
  // spawnPool
  // ...practicing functional style stuff with private members
  // Function dealing with actor spawning in the world
  spawnPool = function () {
    // The enclosed function to use the areaConfig data privately
    function spawnPool(data, world) {
      let spawnPoints = [];
      let actors = [];
      let currentAreaActors = [];

      // Fill private actors from external data
      for (let i = 0; i < data.nbActors; i++) {
        let d = data.actors[i];
        actors.push(d);
      }
      // Get spawn points
      function getSpawnPoints() {
        let spawnPoints = data.actorSpawningPoints;
        return spawnPoints;
      }
      let initSpawnPoints = getSpawnPoints();
      // Fill private spawn points from external data
      for (let i = 0; i < initSpawnPoints.length; i++) {
        spawnPoints.push(initSpawnPoints[i]);
      }
      // Spawn actors if there are actors and spawn points
      if (actors.length && spawnPoints.length) {
        spawnActors(actors);
      }
      // spawnActors
      //
      // Spawn all actors in the game world
      function spawnActors(actors) {
        for (let i = 0; i < actors.length; i++) {
          // Consume new spawn points randomly for each actor to spawn in the world
          let newSpawnPoint = consumeSpawnPoint();
          let actor = actors[i];
          console.log(actor);
          // The actor is a custom sprite that we created, the world is the context passed down in the function call
          let newActor = world.add.existing(new actor(world, newSpawnPoint[0].x, newSpawnPoint[0].y, "NPC"));
          newActor.setName(newActor.type);
          // Setup collision physics with the tilemap for the new actor
          setupActorPhysics(newActor);
        }
        // Create the questionnaire Boss
        const questionnaireBossLocation = {
          x: 300,
          y: 350
        };
        let questionnaireBoss = world.add.existing(new QuestionnaireBoss(world, questionnaireBossLocation.x, questionnaireBossLocation.y, "Questionnaire Boss"));
        world.questionnaireBoss = questionnaireBoss;
        world.physics.world.enable([world.questionnaireBoss]);
        world.questionnaireBoss.body.setCollideWorldBounds(true);
        world.physics.add.collider(world.questionnaireBoss, world.aboveLayer);
        setupActorPhysics(questionnaireBoss);

        function setupActorPhysics(newActor) {
          world.physics.world.enable([newActor]);
          world.physics.add.collider(newActor, world.aboveLayer);
          newActor.body.setBounce(0);
          newActor.body.setImmovable();
          // Set destroyable tag
          newActor.setData('destroyableActor', true);
          // Update current area's actors array
          currentAreaActors.push(newActor);
        }
      }
      // consumeSpawnPoint
      //
      // Gets an available spawn point in the pool of spawn points in the game world. Remove it when an actor is added at that spawn point
      function consumeSpawnPoint() {
        let randomSpawnPoint = Math.floor(Math.random() * spawnPoints.length);
        let consumedSpawnPoint = spawnPoints.splice(randomSpawnPoint, 1);
        // consumedSpawnPoint is an array of a single object containing the random spawn point
        return consumedSpawnPoint;
      }
      // Cache the current area's actors
      world.currentAreaActors = null;
      world.currentAreaActors = currentAreaActors;
    }
    // Return the function for flexible calls
    return spawnPool;
  }
  // Start dialogue with facing actor on frontal collision
  startDialogue(player, actor) {
    // if already locked in a dialogue, return
    if (this.dialogueLock) {
      return;
    }
    if (actor.type === "Questionnaire Boss") {
      this.updateActiveQuest(true);
    }
    // Talk if facing each other
    if (player.body.touching.up && actor.body.touching.down) {
      // Start the first dialogue node of this actor type
      let dialogueNode = 0;
      actor.talk(this, dialogueNode);
    }
  }
  // Talk to the boss to get one
  startQuestAssignment(player, boss) {
    boss.talk(this, dialogueNode);
  }
  // setupDrag
  //
  // Setups the drags on draggable bodies in the game world
  setupDrag() {
    this.input.on('dragstart', (pointer, obj) => {
      obj.body.moves = false;
    });

    this.input.on('drag', (pointer, obj, dragX, dragY) => {
      obj.setPosition(dragX, dragY);
    });

    this.input.on('dragend', (pointer, obj) => {
      obj.body.moves = true;
    });
  }
  // Add typography in certain areas
  addTextDecor() {
    const TEXT_OFFSET = 10;
    this.add.text(this.cameras.main.centerX - TEXT_OFFSET, this.cameras.main.centerY, '1877.').setOrigin(0);
  }
  // Setup actor bounds physics
  setupActorPhysics() {
    this.physics.world.setBounds(0, 0, 4000, 4000);
  }
  // Setup where the player can spawn in Phase one
  setupPlayerSpawningPoints() {
    this.spawnPointA = this.worldTilemap.findObject("GameObjects", obj => obj.name === "spawnPoint");
  }
  // Setup the cameras for the game view
  setupCameras() {
    this.cameras.main.startFollow(this.globalPlayer, true, 0.05, 0.05);
    // this.cameras.main.setZoom(1.5);
    // this.cameras.main.setBounds(0, 0, this.scale.width, this.scale.height);
  }
  // Setup the tilemap
  setupWorldTiles() {
    this.worldTilemap = this.make.tilemap({
      key: "world"
    });
    // Create the tileset from the map, using our preloaded assets
    this.worldTileset = this.worldTilemap.addTilesetImage("16x16-bw-town", "16x16-1bit");
    // Assign the layers using definitions inside the Tiled editor
    this.belowLayer = this.worldTilemap.createStaticLayer("Below", this.worldTileset, 0, 0);
    this.worldLayer = this.worldTilemap.createStaticLayer("World", this.worldTileset, 0, 0);
    this.aboveLayer = this.worldTilemap.createStaticLayer("Above", this.worldTileset, 0, 0);
    // Collide with the above and below layers as defined in the Tiled editor
    this.aboveLayer.setCollisionByProperty({
      collides: true
    });
    this.belowLayer.setCollisionByProperty({
      collides: true
    });
    // Change the blend mode of the world layers to add
    this.worldLayer.setBlendMode(Phaser.BlendModes.ADD);
  }
  // createPlayer
  //
  // Creates and returns a player when called from the controller due to a level start or another player spawning event
  createPlayer() {
    // Return if the player is scene locked due to some game event
    if (this.controller.scenePlayerLock) {
      return;
    }
    // Scale at which the player will be reduced in this world
    const controllerScaleFactor = 0.25;
    // Instantiate the player at the spawn point
    this.globalPlayer = new Player(this, this.spawnPointA.x, this.spawnPointA.y, "hero");
    // Physics bounds
    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);
    // Setup the player's size, scale, interactivity
    this.globalPlayer
      .setScale(controllerScaleFactor)
      .setInteractive();
    this.globalPlayer.body
      .setCollideWorldBounds(true);
    // Player collision with tiles with collide true
    this.physics.add.collider(this.globalPlayer, this.aboveLayer);
    // Play player created sound
    this.controller.playerCreatedSound.play();
    return this.globalPlayer;
  }
  // resize
  // 
  // Resizes the game's width and height of cameras
  resize(newGameSize) {
    let width = newGameSize.width;
    let height = newGameSize.height;
    this.cameras.resize(width, height);
  }
  // Calls the dialogueFactory for a certain dialogue to return and display
  displayDialogue(dialogueData) {
    //Update the dialogue through the html DOM cached in the Hud scene
    let dialogueText = `${dialogueData}`;
    $('#game__hud--dialogue-body').text(dialogueText);
    $('#game__hud--dialogue-body').click(() => {
      $('#game__hud--dialogue-body').text("End of conversation");
      this.dialogueLock = false;
    });
  }
  // Reset the game after Phase 2 is over
  resetGame() {
    // Reset in phase flag for conditional flow leading to phase 1 and 2
    this.inPhase = 1;
    // Reset court seance completed flag (cinematic)
    this.courtSeanceCompleted = false;
    // Update the game progression in local storage
    let currentProgression = this.getProgressionData();
    currentProgression.questionnairesAssignedYet = false;
    currentProgression.questionnairesAnswered = -1; // Start at -1 to sum correctly
    currentProgression.peopleQuestionsLikertA = [];
    currentProgression.animalQuestionsLikertA = [];
    currentProgression.inanimateQuestionsLikertA = [];
    // If any actors (it's possible to have exited game in phase 2, so no spawns), reset current area actors after destroying them and their mind spaces
    if (this.currentAreaActors) {
      for (let i = 0; i < this.currentAreaActors.length; i++) {
        if (this.currentAreaActors[i].mindSpaceForm) {
          this.currentAreaActors[i].mindSpaceForm.destroy();
        }
      }
      // Remove all game objects from the scene adder
      let allChildren = this.add.displayList.getChildren();
      let destroyedActors = [];
      for (let i = 0; i < allChildren.length; i++) {
        // Destroy previous actors
        if (allChildren[i].getData('destroyableActor') === true) {
          destroyedActors.push(allChildren[i]);
          allChildren[i].destroy();
        }
      }
      this.currentAreaActors = null;
    }
    // Reset player position
    this.globalPlayer.setPosition(this.spawnPointA.x, this.spawnPointA.y);
    // Reset the area config after increasing current area flag
    this.currentArea++;
    this.areaConfig = this.areaManager(this.currentArea);
    // Update number of questionnaires needed in next area / level 
    currentProgression.currentRoundQuestionnaires = this.areaConfig.nbQuestionnaires;
    localStorage.setItem("gameProgression", JSON.stringify(currentProgression));
    // Re-get the new added spawn points from the tilemap, by filtering through the Tiled layers
    this.areaConfig.actorSpawningPoints = this.worldTilemap.filterObjects("GameObjects", (obj) => obj.name.includes("actorSpawnPoint"));
    // Re-update the progress UI
    updateProgressUI(currentProgression);
  }
}
// Game progression data (localStorage)
// Whether the player got his questionnaires from phase 1 yet
// For each round, questionnaires answered and the total number of quests
let gameProgression = {
  questionnairesAssignedYet: false,
  questionnairesAnswered: -1, // Start at -1 to count properly
  currentRoundQuestionnaires: 0,
  peopleQuestionsLikertA: [],
  animalQuestionsLikertA: [],
  inanimateQuestionsLikertA: [],
  totalQuestionsAnswered: 0,
  peopleDiscovered: 0,
  animalsDiscovered: 0,
  inanimateDiscovered: 0,
  gold: 0,
  bookCompletion: 0
}
$('document').ready(setup);
let $hamburgerMenu;
let $navBar;
let sticky;
// If two moments are currently linked
let updateDataAndActiveConnections = false;
let createLink = false;
// setup
//
// Setups the website's elements
function setup() {
  $hamburgerMenu = $('.nav__hamburger-menu');
  $navBar = $('#navBar');
  const STICKY_OFFSET = 10;
  sticky = $hamburgerMenu.offset().top - STICKY_OFFSET;
  window.onscroll = function () {
    handleNav();
  };
}
// handleNav
//
// Positions (sticky) the hamburger menu that i even drew myself
function handleNav() {
  if (window.pageYOffset >= sticky) {
    $navBar.addClass('sticky');
    $hamburgerMenu.addClass('sticky');
  } else {
    $navBar.removeClass('sticky');
    $hamburgerMenu.removeClass('sticky');
  }
}
let changeToPhaseTwoEmmitter = null; // Event emitter to avoid always checking for change in update()
// handleFormSubmit
//
// handles the form submission from questionnaires
function handleFormSubmit(form) {
  // Remove dialogue lock
  this.dialogueLock = false;
  // Remove actor portrait 
  $('#game__agreeForm-actor-portrait').remove();
  let currentProgression = JSON.parse(localStorage.getItem("gameProgression"));
  let userAnswer;
  // Save the user's answer to local storage -- gets form's elements by their name
  let answeredForm = form.elements["likert-a"];
  for (let i = 0; i < answeredForm.length; i++) {
    if (answeredForm[i].checked) {
      userAnswer = answeredForm[i].value;
      currentProgression.peopleQuestionsLikertA.push(userAnswer);
      updateStatsQuestionsAnswered(currentProgression);
      // Todo push question as well
    }
  }
  // Refresh current progression
  currentProgression = JSON.parse(localStorage.getItem("gameProgression"));
  // Emit a change phase (from phase one to phase two) event if finished this round. -1 to count properly
  let q = currentProgression.currentRoundQuestionnaires;
  let currentQTotal = q - 1;
  // Expect currentProgression.questionnairesAnswered = 0
  if (currentProgression.questionnairesAnswered >= currentQTotal) {
    updateProgressUI(currentProgression);
    changeToPhaseTwoEmmitter.emit('changePhase');
  }
  $(".game__agreeForm").remove();
  // Re-update UI
  updateProgressUI(currentProgression);
  return false;
}
// updateStatsQuestionsAnswered
//
// Setups the website's elements
function updateStatsQuestionsAnswered(currentProgression) {
  let thisCurrentProgression = currentProgression;
  // If player answered a questionnaire update total progression stats for it
  thisCurrentProgression.totalQuestionsAnswered++;
  // Update current round progression
  let q = thisCurrentProgression.questionnairesAnswered;
  let currentQTotal = q + 1;
  thisCurrentProgression.questionnairesAnswered = currentQTotal;
  // Add gold reward to the player
  let goldAmount = 10;
  thisCurrentProgression.gold += goldAmount;
  localStorage.setItem("gameProgression", JSON.stringify(thisCurrentProgression));
}
// Update the progress box UI
function updateProgressUI(currentProgression) {
  let stats_totalQuestionsAnsweredText = "Questions Answered (/10): ";
  //Update the progression tab menu
  $('#stats--questionsAnswered').text(`${stats_totalQuestionsAnsweredText} ${currentProgression.totalQuestionsAnswered}`);
  //Update the HUD
  let stats_hud = `Questionnaires Filled: (${currentProgression.questionnairesAnswered + 1}/${currentProgression.currentRoundQuestionnaires})`;
  $('#game__hud--score').text(stats_hud);
  //Updated gold earned
  let goldEarnedText;
  if(currentProgression.gold >= 0) {
    goldEarnedText = `Gold Earned: ${currentProgression.gold}`;
  } else {
    goldEarnedText = `Gold Earned: 0`;
  }
  $('#game__hud--inventory--gold').text(goldEarnedText);
}