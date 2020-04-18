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
        // Show the questionnaire if none exists yet and if not in a dialogue yet
        if(!this.mindSpaceForm && !this.questionnaire && !scene.scene.manager.getScene('UI').dialogueLock) {
            this.questionnaire = scene.add.dom().createFromCache('agreeForm');
            this.questionnaire.setScale(0.25);
            this.questionnaire.setPosition(scene.globalPlayer.x, scene.globalPlayer.y + 25);
            $(".game__agreeForm").draggable();
            // Adds an onsubmit handler on the form
            let textBox = scene.scene.manager.getScene('UI').dialogueFactory.textBoxCache;
            $('#agreeForm').attr("onsubmit", "return handleFormSubmit(this)")
            // this.mindSpaceForm = scene.add.existing(new MindSpaceForm(scene, this.x, this.y, this));
            // this.mindSpaceForm.setScale(0.5);
            // // Setup drag mechanics and physics
            // scene.input.setDraggable(this.mindSpaceForm);
            // scene.physics.world.enable([this.mindSpaceForm]);
            // this.mindSpaceForm.body.setCollideWorldBounds(true);
            // Show time left (s)
            setInterval(()=> { 
                var p = document.getElementById('questionTimeLeft'); 
                if(!p) {
                    return;
                }
                p.value-=10
            }, 1000);
            // Destroy questionnaire after 10s
            setTimeout(()=> { 
                if(this.questionnaire) {
                    this.questionnaire.destroy(); 
                    this.questionnaire = null;     
                    textBox.destroy();
                }
            }, 10000);
        }
        // Take a random question node for actor type to display
        this.displayDialogue(scene, threadNode);      
    }
    
    // displayDialogue
    //
    // Displays the dialogue (requesting the UI scene to draw the dialogue boxes with the dialogue data)
    displayDialogue(scene, threadNode) {
        const mindSpaceData = scene.cache.json.get('mindSpaces');
        // The different dialogues available for this type of actor
        let dialogueThreads = [];
        for(let i = 0; i < mindSpaceData.length; i++) {
            let type = mindSpaceData[i]["type"];
            if(type === this.type) {
                let obj = mindSpaceData[i];
                dialogueThreads.push(obj);
            }
        }
        let randomIndex = Math.floor(Math.random() * dialogueThreads.length);
        let thread = dialogueThreads[randomIndex]["data"][0];
        const df = scene.scene.manager.getScene('UI').dialogueFactory;
        const UI = scene.scene.manager.getScene('UI');
        UI.dialogueDisplayer.displayDialogue(threadNode, "question", thread, df, UI);
    }
}