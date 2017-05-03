var AutoComposerJS = window.AutoComposerJS || {};

AutoComposerJS.melody = require('./melody');
AutoComposerJS.midiWriter = require('./midi-writer');
AutoComposerJS.midiPlayer = require('./midi-player');
AutoComposerJS.logic = require('./logic');
AutoComposerJS.constants = require('./constants');

window.AutoComposerJS = AutoComposerJS;

module.exports = AutoComposerJS;
