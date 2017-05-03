var AutoComposerJS = window.AutoComposerJS || {};

AutoComposerJS.melody = require('./autocomposer-melody');
AutoComposerJS.midiWriter = require('./autocomposer-midi-writer');
AutoComposerJS.midiPlayer = require('./autocomposer-midi-player');
AutoComposerJS.logic = require('./autocomposer-logic');
AutoComposerJS.constants = require('./autocomposer-constants');

window.AutoComposerJS = AutoComposerJS;
