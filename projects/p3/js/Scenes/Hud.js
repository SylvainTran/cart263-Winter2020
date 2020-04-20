/**
 * Hud
 * 
 * Creates a hud by taking in injected UI objects.
 * Displays the box that keeps track of the completed questionnaires out of total
 * Displays the context menus for scenes.
 */
class Hud extends Phaser.Scene {
    constructor() {
        super('Hud');
        // Number of questionnaires to answer left in this round        
        this.roundTally = null;
    }

    // Keep track of the player's completed questionnaires.
    create() {
        this.roundTally = this.add.dom().createFromCache('hud');
        this.roundTally.setVisible(true);
    }

    // From Mr. Rex Rainbow (MIT license) - Creates dialogue
    createDialog(sceneToSpawn, x, y, onClick, sceneClicked) {
        let createLabel = this.createLabel;
        let dialog = this.rexUI.add.dialog({
                x: x,
                y: y,
                width: 250,
                background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, COLOR_PRIMARY),
                title: createLabel(this, 'Actions').setDraggable(),
                //content: createLabel(this, ''),
                //description: createLabel(this, sceneClicked.parent.name),
                choices: [
                    createLabel(this, 'Text'),
                    createLabel(this, 'Enter Dimension'),
                    createLabel(this, 'Leave Dimension (if entered)'),
                    // createLabel(this, 'Image'),
                    // createLabel(this, 'Game'),
                    // createLabel(this, 'Ephemeral')
                ],
                actions: [
                    createLabel(this, 'Confirm'),
                    createLabel(this, 'Exit')
                ],
                space: {
                    left: 20,
                    right: 20,
                    top: -20,
                    bottom: -20,

                    title: 25,
                    titleLeft: 30,
                    content: 25,
                    description: 25,
                    descriptionLeft: 20,
                    descriptionRight: 20,
                    choices: 25,

                    toolbarItem: 5,
                    choice: 15,
                    action: 15,
                },
                expand: {
                    title: false,
                    // content: false,
                    // description: false,
                    // choices: false,
                    // actions: true,
                },
                align: {
                    title: 'center',
                    actions: 'right',
                },
                click: {
                    mode: 'release'
                }
            }).setDraggable('background')
            .layout()
            .popUp(1000);

        // Tweening it
        let tween = this.tweens.add({
            targets: dialog,
            scaleX: 1,
            scaleY: 1,
            ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1000,
            repeat: 0, // -1: infinity
            yoyo: false
        });
        // Event handler for clicking items in the dialog
        dialog.on('button.click', (button, groupName, index, pointer, event) => {
            onClick(button);
        }, this);
        dialog.on('button.over', (button, groupName, index) => {
            button.getElement('background').setStrokeStyle(1, 0xffffff);
        }, this);
        dialog.on('button.out', (button, groupName, index) => {
            button.getElement('background').setStrokeStyle();
        }, this);
        return dialog;
    }

    // Create a label in the scene for the create text dialog (Rex UI)
    createLabel(scene, text) {
        return scene.rexUI.add.label({
            width: 40,
            height: 40,
            background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, COLOR_DARK),
            text: scene.add.text(0, 0, text, {
                fontSize: '24px'
            }),
            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }
        });
    }
}