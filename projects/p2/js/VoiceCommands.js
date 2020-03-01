
let commands = {
    'Start working': function() {
        // if in a good mood or state, will obey
        responsiveVoice.speak("Cleaning up the floor, sir. New Content Uploaded.", "UK English Female", options);
        createNewYoutubeContent();
        rotateMe();
        // if not, disobey
        //responsiveVoice.speak("Nah, I won't do it.", "UK English Female", options);        
    },
    'Stop working': () => {
        responsiveVoice.speak("There wasn't much to do anyway.", "UK English Female", options);
    },
    'Take a stroll': () => {
        responsiveVoice.speak("Everyone deserves a good stroll", "UK English Female", options);        
    }
}

// options()
//
// Options for rate and pitch be random for some reason
let options = {
    "rate": Math.random(),
    "pitch": Math.random()
}