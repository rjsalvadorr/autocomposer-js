var assert = require('assert');

var AutoComposerLogic = require('../index').logic;

describe('AutoComposerLogic', function() {
  describe('#filterMelodyRange', function() {
    it('should filter out melodies that have a range larger than an octave', function() {
      // The filter function runs on each note addition for the melody generating function.
      // So it should only be expected to look at the difference between the last two notes.

      melodySmallRange = "C4 G4 A4";
      melodyOctaveRange = "G4 C4 C5";
      melodyBigRange = "G4 C4 D5";

      assert.equal(AutoComposerLogic.filterMelodyRange(melodySmallRange), true);
      assert.equal(AutoComposerLogic.filterMelodyRange(melodyOctaveRange), true);
      assert.equal(AutoComposerLogic.filterMelodyRange(melodyBigRange), false);
    });
  });

  describe('#filterRepetition', function() {
    it('should filter out melodies that are too repetitive', function() {
      melodyNoRepeats = "C4 G4 A4 E5";
      melodyOneRepeat = "C4 G4 G4 C5 E5";
      melodyTwoRepeats = "C4 C4 G4 D5 D5 E3";
      melodyTwoSuccessiveRepeats = "C4 G4 G4 G4 D5 C5";

      assert.equal(AutoComposerLogic.filterRepetition(melodyNoRepeats), true);
      assert.equal(AutoComposerLogic.filterRepetition(melodyOneRepeat), true);
      assert.equal(AutoComposerLogic.filterRepetition(melodyTwoRepeats), false);
      assert.equal(AutoComposerLogic.filterRepetition(melodyTwoSuccessiveRepeats), false);
    });
  });

  describe('#isValidText', function() {
    it('should return true for chord inputs', function() {
      assert.equal(AutoComposerLogic.isValidText('Gm7'), true);
      assert.equal(AutoComposerLogic.isValidText('C'), true);
      assert.equal(AutoComposerLogic.isValidText('D7'), true);
      assert.equal(AutoComposerLogic.isValidText('A#m7b5'), true);
    });

    it('should return false for non-chord inputs', function() {
      assert.equal(AutoComposerLogic.isValidText('H2'), false);
      assert.equal(AutoComposerLogic.isValidText('456456'), false);
      assert.equal(AutoComposerLogic.isValidText('Something really silly'), false);
    });
  });

  describe('#convertAsciiAccidentalsToHtml', function() {
    it('should convert ASCII accidentals to Unicode HTML entities', function() {
      assert.equal(AutoComposerLogic.convertAsciiAccidentalsToHtml('Bb'), 'B&#9837;');
      assert.equal(AutoComposerLogic.convertAsciiAccidentalsToHtml('C#'), 'C&#9839;');
      assert.equal(AutoComposerLogic.convertAsciiAccidentalsToHtml('Fo'), 'F&‌deg;');
    });
  });

  describe('#convertAsciiAccidentalsToText', function() {
    it('should convert ASCII accentals to Unicode versions', function() {
      assert.equal(AutoComposerLogic.convertAsciiAccidentalsToText('Bb'), 'B♭');
      assert.equal(AutoComposerLogic.convertAsciiAccidentalsToText('C#'), 'C♯');
      assert.equal(AutoComposerLogic.convertAsciiAccidentalsToText('Fo'), 'F°');
    });
  });

  describe('#convertAccidentalsToAscii', function() {
    it('should convert Unicode accentals to ASCII versions', function() {
      assert.equal(AutoComposerLogic.convertAccidentalsToAscii('B♭'), 'Bb');
      assert.equal(AutoComposerLogic.convertAccidentalsToAscii('C♯'), 'C#');
      assert.equal(AutoComposerLogic.convertAccidentalsToAscii('F°'), 'Fo');
    });
  });
});
