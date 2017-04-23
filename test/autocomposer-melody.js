var assert = require('assert');
const _ = require('underscore');

var AcMelody = require('../src/autocomposer-melody');
var AutoComposerMelody = new AcMelody.AutoComposerMelody();

var AutoComposerData = require('../src/autocomposer-data');
var AcData = new AutoComposerData.AutoComposerData();

var TEST_CHORD_1 = "Gm7";
var TEST_CHORD_2 = "Cm7";
var TEST_CHORD_3 = "D7";

var TEST_LOWER_LIMIT_1 = "Bb3";
var TEST_UPPER_LIMIT_1 = "G#4";

var TEST_LOWER_LIMIT_2 = "Ab4";
var TEST_UPPER_LIMIT_2 = "B5";

describe('AutoComposerMelody', function() {
  describe('#getAllChordTones', function() {
    it('should return all chord tones in the range (inclusive)', function() {
      expectedTones1 = ["Bb3", "D4", "F4", "G4"];
      expectedTones2 = ["A4", "C5", "D5", "F#5", "A5"];

      resultTones1 = AutoComposerMelody.getAllChordTones(TEST_CHORD_1, TEST_LOWER_LIMIT_1, TEST_UPPER_LIMIT_1);
      resultTones2 = AutoComposerMelody.getAllChordTones(TEST_CHORD_3, TEST_LOWER_LIMIT_2, TEST_UPPER_LIMIT_2);

      assert.deepEqual(resultTones1, expectedTones1);
      assert.deepEqual(resultTones2, expectedTones2);
    });
  });

  describe('#buildChordUnitList', function() {
    it('should return a list of ChordUnits for a given progression', function() {
      var expChordUnit3 = {
        chord: "D7",
        chordTones: ["A4", "C5", "D5", "F#5", "A5"],
      };
      var expChordUnit2 = {
        chord: "Cm7",
        chordTones: ["Bb4", "C5", "Eb5", "G5", "Bb5"],
      };
      var expChordUnit1 = {
        chord: "Gm7",
        chordTones: ["Bb4", "D5", "F5", "G5", "Bb5"],
      };

      var expectedArray = [expChordUnit1, expChordUnit2, expChordUnit3];
      var chordProgression = ["Gm7","Cm7","D7"];
      var chordUnitList = AutoComposerMelody.buildChordUnitList(chordProgression, TEST_LOWER_LIMIT_2, TEST_UPPER_LIMIT_2);

      assert.deepEqual(chordUnitList[0].chordTones, expectedArray[0].chordTones);
      assert.deepEqual(chordUnitList[1].chordTones, expectedArray[1].chordTones);
      assert.deepEqual(chordUnitList[2].chordTones, expectedArray[2].chordTones);
    });
  });

  describe('#buildMelodyUnit', function() {
    it('should build a melody unit with metadata for each raw melody', function() {
      var chordProgression = ["G", "Em", "C", "D"];
      var melody1 = "B3 G4 E4 F#4";
      var melody2 = "G4 B4 C5 D5";

      exp1 = {
        chordProgression: chordProgression,
        melodyNotes: melody1.split(" "),
        smoothness: 13,
        range: 8,
        contour: ""
      }

      exp2 = {
        chordProgression: chordProgression,
        melodyNotes: melody2.split(" "),
        smoothness: 7,
        range: 7,
        contour: ""
      }

      result1 = AutoComposerMelody.buildMelodyUnit(chordProgression, melody1);
      result2 = AutoComposerMelody.buildMelodyUnit(chordProgression, melody2);

      assert.deepEqual(result1, exp1);
      assert.deepEqual(result2, exp2);
    });
  });

  describe('#buildMelodyUnitList', function() {
    var chordProgression = ["G", "Em", "C", "D"];
    var melodies = ["B3 G4 E4 F#4", "G4 B4 C5 D5", "G4 G4 G4 F#4", "G5 G5 G5 A5"];

    it('should sort the output if specified', function() {
      resultSorted = AutoComposerMelody.buildMelodyUnitList(chordProgression, melodies, {sort: true});

      assert(resultSorted[0].smoothness < resultSorted[3].smoothness);
    });

    it('should limit the output if specified', function() {
      var numLimit = 2;
      result = AutoComposerMelody.buildMelodyUnitList(chordProgression, melodies, {limit: numLimit});

      assert.equal(result.length, numLimit);
    });
  });

  describe('#getMelodies', function() {
    it('should return a list of melodies for a given progression', function() {
      var chordProgression = ["Gm","Cm","D"];
      var melodyList = AutoComposerMelody.getAllMelodies(chordProgression);

      assert.equal(melodyList.length, 252);
      assert.equal(typeof melodyList[0] === 'string', false);
    });

    it('should return less melodies if filters are on', function() {
      var chordProgression = ["Gm","Cm","D"];
      var melodyList = AutoComposerMelody.getMelodies(chordProgression);

      assert.equal(melodyList.length, AcData.NUM_MELODIES_LIMIT);
      assert.equal(typeof melodyList[0] === 'string', false);
    });

    it('should return raw melodies as a string array', function() {
      var chordProgression = ["Gm","Cm","D"];
      var melodyList = AutoComposerMelody.getRawMelodies(chordProgression);

      assert.equal(typeof melodyList[0] === 'string', true);
    });
  });
});
