// NPC
//
// NPCs
class NPC extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name) {
        super(scene, x, y);
        this.setPosition(x, y);
        this.setInteractive();
        this.name = name;
        // The mind space that pop ups on top of a NPC
        this.mindSpaceForm = null;
        // The questionnaire to study the interaction between player when quizzed in a game
        this.questionnaire = null;
    }

    // getName
    //
    // gets this NPC's name
    getName() {
        return this.name;
    }

    // setName
    //
    // sets this NPC's name if there is a name to set
    setName(value) {
        if(value !== null) {
            this.name = value;
        }
        return this;
    }

    // talk
    //
    // Talk to this NPC 
    talk(scene, threadNode) {
        console.log("Talking to: " + this.getName());
        let UI = scene.scene.manager.getScene('UI');
        // Show the questionnaire if none exists yet and if not in a dialogue yet
        if(!this.mindSpaceForm && !this.questionnaire && !UI.dialogueLock) {
            // Create the questionnaire
            this.questionnaire = scene.add.dom().createFromCache('agreeForm');
            this.questionnaire.setScale(0.25);
            this.questionnaire.setPosition(scene.globalPlayer.x + 100, scene.globalPlayer.y + 75);
            // #JQuery
            $(".game__agreeForm").draggable();
            // Adds an onsubmit handler on the form
            // #JQuery
            $('#agreeForm').attr("onsubmit", "return handleFormSubmit(this)")
            // Create the weird mindspaceform that cues the NPC's secret desire             
            this.mindSpaceForm = scene.add.existing(new MindSpaceForm(scene, this.x, this.y, this));
            this.mindSpaceForm.setScale(0.5);
            // Tweens
            let tweens = scene.tweens.add({
                targets: [this.questionnaire, this.mindSpaceForm],
                x: '+=15',
                y: '+=30',
                ease: 'Bounce',
                duration: 500,
                repeat: 0,
                yoyo: false
            });
            // Show time left in (s)
            setInterval(()=> { 
                var p = document.getElementById('questionTimeLeft'); 
                if(!p) {
                    return;
                }
                p.value-=10;
            }, 1000);
            if(this.type === "Questionnaire Boss") {
                // Then assign questionnaires to the player
            }
        }
        // Take a random question node for actor type to display
        this.displayDialogue(scene);      
    }
    
    // displayDialogue
    //
    // Displays the dialogue (requesting the UI scene to draw the dialogue boxes with the dialogue data)
    displayDialogue(scene) {
        const mindSpaceData = scene.cache.json.get('mindSpaces');
        // Get the different dialogues available for this type of actor
        let dialogueThreads = [];
        for(let i = 0; i < mindSpaceData.length; i++) {
            let type = mindSpaceData[i]["type"];
            // Compare this actor's type with the JSON object
            if(type === this.type) {
                let obj = mindSpaceData[i];
                dialogueThreads.push(obj);
            }
        }
        // Get a random dialogue node for this type of actor
        const randomIndex = Math.floor(Math.random() * dialogueThreads.length);
        const thread = dialogueThreads[randomIndex]["data"][0]["question"];
        console.log(thread);
        const UI = scene.scene.manager.getScene('UI');
        scene.displayDialogue(thread, UI);
    }
}