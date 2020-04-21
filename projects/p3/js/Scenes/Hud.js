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
        this.hudWindows = null;
    }

    // Keep track of the player's completed questionnaires.
    create() {
        this.hudWindows = this.add.dom().createFromCache('hud');
        this.hudWindows.setVisible(true);
        this.hudWindows.setPosition(0, 300);
        $('#game__hud--dialogue').draggable();
    }
}