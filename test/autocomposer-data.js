var assert = require('assert');

var AcLogic = require('../src/autocomposer-logic');
var AutoComposerLogic = new AcLogic.AutoComposerLogic();

describe('AutoComposerLogic', function() {
  describe('#filterMelodyRange', function() {
    it('should filter out melodies that have a range larger than an octave', function() {
      melodySmallRange = "C4 G4 A4";
      melodyOctaveRange = "C4 G4 C5";
      melodyBigRange = "C4 G4 D5";

      assert.equal(AutoComposerLogic.filterMelodyRange(melodySmallRange), true);
      assert.equal(AutoComposerLogic.filterMelodyRange(melodyOctaveRange), true);
      assert.equal(AutoComposerLogic.filterMelodyRange(melodyBigRange), false);
    });
  });
});
