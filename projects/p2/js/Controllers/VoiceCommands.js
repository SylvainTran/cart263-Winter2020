// 2020-03-01
// The mindless slaves will obey with enough money, -- the more
// money the player gives them to create youtube content,
// the more crazed and disturbing the video will be
// The in-game gameplay is that after issuing money bags to automatas by picking them up,
// the player can issue vocal commands to make the robots line up in the factory assembly and
// start producing shit videos depending on the money amount given
// Automatons who have not been paid will start doing the videos
// about what they actually like instead
let commands = {
    'Start working': function() {
        // if has enough incentive/money bags, will create a suspicious video
        // otherwise will create art or something
        workCommandIssued = true;

        responsiveVoice.speak("Cleaning up the floor, sir. New Content Uploaded.", "UK English Female", options);
        createNewYoutubeContent();

        // if not, disobey -- Artefact of early project idea
        //responsiveVoice.speak("Nah, I won't do it.", "UK English Female", options);
    },
    'Stop working': () => {
        responsiveVoice.speak("There wasn't much to do anyway.", "UK English Female", options);
    },
    'Take a stroll': () => {
        responsiveVoice.speak("Everyone deserves a good stroll", "UK English Female", options);
    }
};

// options()
//
// Options for rate and pitch be random for some reason
let options = {
    "rate": Math.random(),
    "pitch": Math.random()
}

// givePlayerLoot()
//
// Give loot for the player upon voice command while in the Youtube Creator Studio -> to be refactored later
function givePlayerLoot(player, lootValue) {
  player.inventory.setInventory(lootValue);
}
