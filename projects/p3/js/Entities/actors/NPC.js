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
        // Actor portrait that shows up in dialogues -- may be used for animation
        this.actorPortrait = null;
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
        // return if already questioned
        if (this.questionedPlayerYet) {
            return;
        }
        // Show the questionnaire if none exists yet and if not in a dialogue yet
        if (!this.mindSpaceForm && !this.questionnaire && !scene.dialogueLock) {
            // Lock player in dialogue while he's yet to have answered the questionnaire
            scene.dialogueLock = true;
            // Show time left in (s)
            let interval = setInterval(() => {
                let timer = document.getElementById('questionTimeLeft');
                if (!timer) {
                    return;
                }
                // Decrease the timer's value, clear interval when hit 0
                timer.value -= 10;
                if (timer.value <= 0) {
                    timer = 0;
                    clearInterval(interval);
                }
            }, 1000);
            // Create the questionnaire
            this.questionnaire = scene.add.dom().createFromCache('agreeForm');
            this.questionnaire.setPosition(this.scale.width / 2.75, this.scale.height / 2);
            // Adds an onsubmit handler on the form - 'this' as arg is the #agreeForm element
            $('#agreeForm').attr("onsubmit", "return handleFormSubmit(this)");
            // Remove the dialogue lock if we click on the submit button
            $('#agreeFormSubmit').click(() => {
                scene.dialogueLock = false;
                // Clear timer to prevent multiple timers
                clearInterval(interval);
            });
            // Display actor portrait 
            // TODO high res version of this actor texture
            this.actorPortrait = scene.add.dom().createFromCache('actorPortrait');
            this.actorPortrait.setPosition(this.scale.width / 2.75, this.scale.height / 2);
            let portraitDiv = $('#portrait');
            portraitDiv.attr("src", `assets/images/sprites/actors/${this.texture.key}.png`);
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
            if (this.type === "questionnaireBoss") {
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
    }
}