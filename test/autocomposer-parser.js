var assert = require('assert');

var AcParser = require('../src/autocomposer-logic.js');
var AutoComposerLogic = new AcParser.AutoComposerLogic();

describe('AutoComposerLogic', function() {
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
