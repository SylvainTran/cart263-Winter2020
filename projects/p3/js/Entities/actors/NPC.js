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
        // flag to check if already questioned player
        this.questionedPlayerYet = false;
        // flag to check if currently questioning player
        this.isQuestioning = false;
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
        if (value !== null) {
            this.name = value;
        }
        return this;
    }

    // talk
    //
    // Talk to this NPC 
    talk(scene, threadNode) {
        // If already questioning player, return
        if (this.isQuestioning) {
            return;
        }
        console.log("Talking to: " + this.getName());
        let UI = scene.scene.manager.getScene('UI');
        // Show the questionnaire if none exists yet and if not in a dialogue yet
        if (!this.mindSpaceForm && !this.questionnaire && !scene.dialogueLock) {
            // Create the questionnaire
            this.questionnaire = scene.add.dom().createFromCache('agreeForm');
            this.questionnaire.setPosition(this.scale.width/2.75, this.scale.height/2);
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
            setInterval(() => {
                var p = document.getElementById('questionTimeLeft');
                if (!p) {
                    return;
                }
                p.value -= 10;
            }, 1000);
            if (this.type === "Questionnaire Boss") {
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
        // Update the NPC's current dialogue flag
        this.isQuestioning = true;
        // return if already questioned. means could talk before this point
        if(this.questionedPlayerYet) {
            return;
        }
        // Now can't question player anymore
        this.questionedPlayerYet = true;
        const mindSpaceData = scene.cache.json.get('mindSpaces');
        // Get the different dialogues available for this type of actor
        let dialogueThreads = [];
        for (let i = 0; i < mindSpaceData.length; i++) {
            let type = mindSpaceData[i]["type"];
            // Compare this actor's type with the JSON object
            if (type === this.type) {
                let obj = mindSpaceData[i];
                dialogueThreads.push(obj);
            }
        }
        // Get a random dialogue node for this type of actor
        const randomIndex = Math.floor(Math.random() * dialogueThreads.length);
        const thread = dialogueThreads[randomIndex]["data"][0]["question"];
        // PIPPIN, I GRADUATED FROM USING REX' DIALOGUE PLUGIN USING THE FOLLOWING ONE LINE OF CODE:
        $('#question-container').text(thread);
        // SADLY I ONLY HAVE 10 MORE MINUTES LEFT
        // Can retalk after 5 seconds. $Stretch: other dialogue than questionnaire
        setTimeout(() => {
            this.isQuestioning = false;
            scene.dialogueLock = false;
        }, 5000);
    }
}