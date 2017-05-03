// Testing to see if the package works properly.
var assert = require('assert');
var AutoComposer = require('../index');

describe('AutoComposer', function() {
  it('should create a variety of simple melodies', function() {
    var chordProgression = ["G", "Em", "C", "D"];
    var results = AutoComposer.melody.buildSimpleMelodies(chordProgression);

    assert(results, "melody.buildSimpleMelodies() failed!");
  });
});
