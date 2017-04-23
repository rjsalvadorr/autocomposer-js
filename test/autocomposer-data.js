var assert = require('assert');

var AcData = require('../src/autocomposer-data');
var AutoComposerData = new AcData.AutoComposerData();

describe('AutoComposerData', function() {
  describe('#filterMelodyRange', function() {
    it('should filter out melodies that have a range larger than an octave', function() {
      melodySmallRange = "C4 G4 A4";
      melodyOctaveRange = "C4 G4 C5";
      melodyBigRange = "C4 G4 D5";

      assert.equal(AutoComposerData.filterMelodyRange(melodySmallRange), true);
      assert.equal(AutoComposerData.filterMelodyRange(melodyOctaveRange), true);
      assert.equal(AutoComposerData.filterMelodyRange(melodyBigRange), false);
    });
  });
});
