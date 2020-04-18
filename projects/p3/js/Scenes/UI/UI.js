/**
 * UI
 * 
 * Displays the dialogue UI
 */
class UI extends Phaser.Scene {
    constructor() {
        super('UI');
        // Dialogue Factory and Displayer objects
        this.dialogueFactory = new DialogueFactory();
        this.dialogueDisplayer = new DialogueDisplayer();
        this.dialogueLock = false; // Whether the player is currently locked in a conversation thread to prevent mixing dialogue calls
    }

    init() {

    }

    preload() {
        this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
    }

    create() {
        // The chapters is for specifying which JSON file to get
        // First level of the JSON array: the index is for which dialogue object in the JSON file
        const chapters = this.cache.json.get('chapters')[0];
        // Second level: the key is for the dialogue chapters' object selected in the first level
        const key = "chapterOne";
        // Third level: the index for the chapter array is the dialogue node for the array selected in the second level
        const node = 0;
        // Display the dialogue; the introduction is the first node (index) of the JSON object
        this.dialogueDisplayer.displayDialogue(node, key, chapters, this.dialogueFactory, this);
    }

    // From Rex Rainbow (MIT License) - Adds the built in text (as per the Phaser Text object) with config parameters
    getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight) {
        return scene.add.text(0, 0, '', {
                fontSize: '20px',
                wordWrap: {
                    width: wrapWidth
                },
                maxLines: 3
            })
            .setFixedSize(fixedWidth, fixedHeight);
    }
    // From Rex Rainbow (MIT License) - Adds the BBCode as per the Phaser BBCodeText object with config parameters
    getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight) {
        return this.rexUI.add.BBCodeText(0, 0, '', {
            fixedWidth: fixedWidth,
            fixedHeight: fixedHeight,

            fontSize: '20px',
            wrap: {
                mode: 'word',
                width: wrapWidth
            },
            maxLines: 3
        })
    }
}