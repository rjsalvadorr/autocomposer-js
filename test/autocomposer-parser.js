var assert = require('assert');

var AcParser = require('../src/autocomposer-parser.js');
var AutoComposerParser = new AcParser.AutoComposerParser();

describe('AutoComposerParser', function() {
  describe('#isValidText', function() {
    it('should return true for chord inputs', function() {
      assert.equal(AutoComposerParser.isValidText('Gm7'), true);
      assert.equal(AutoComposerParser.isValidText('C'), true);
      assert.equal(AutoComposerParser.isValidText('A#m7b5'), true);
    });

    it('should return false for non-chord inputs', function() {
      assert.equal(AutoComposerParser.isValidText('H2'), false);
      assert.equal(AutoComposerParser.isValidText('456456'), false);
      assert.equal(AutoComposerParser.isValidText('Something really silly'), false);
    });
  });

  describe('#convertAsciiAccidentalsToHtml', function() {
    it('should convert ASCII accidentals to Unicode HTML entities', function() {
      assert.equal(AutoComposerParser.convertAsciiAccidentalsToHtml('Bb'), 'B&#9837;');
      assert.equal(AutoComposerParser.convertAsciiAccidentalsToHtml('C#'), 'C&#9839;');
      assert.equal(AutoComposerParser.convertAsciiAccidentalsToHtml('Fo'), 'F&‌deg;');
    });
  });

  describe('#convertAsciiAccidentalsToText', function() {
    it('should convert ASCII accentals to Unicode versions', function() {
      assert.equal(AutoComposerParser.convertAsciiAccidentalsToText('Bb'), 'B♭');
      assert.equal(AutoComposerParser.convertAsciiAccidentalsToText('C#'), 'C♯');
      assert.equal(AutoComposerParser.convertAsciiAccidentalsToText('Fo'), 'F°');
    });
  });

  describe('#convertAccidentalsToAscii', function() {
    it('should convert Unicode accentals to ASCII versions', function() {
      assert.equal(AutoComposerParser.convertAccidentalsToAscii('B♭'), 'Bb');
      assert.equal(AutoComposerParser.convertAccidentalsToAscii('C♯'), 'C#');
      assert.equal(AutoComposerParser.convertAccidentalsToAscii('F°'), 'Fo');
    });
  });
});
