// For calculating big numbers, and possible ways to optimize the application.

var AutoComposerData = require('../src/autocomposer-data');
var AcData = new AutoComposerData.AutoComposerData();

var AutoComposerMelody = require('../src/autocomposer-melody');
var AcMelody = new AutoComposerMelody.AutoComposerMelody();

var AutoComposerParser = require('../src/autocomposer-parser');
var AcParser = new AutoComposerParser.AutoComposerParser();

class CalculationExploration {
  constructor() {
    this.pitches = ["Ab", "A", "A#", "Bb", "B", "Cb", "C", "C#", "Db", "D", "D#", "Eb", "E", "E#", "F", "F#", "Gb", "G", "G#"];
  }

  /*
  One thing I'm interested in - the average number of chord tones for certain chords, in relation to the range given.
  It may be nice to know the average # of chord tones for triads, tetrads, and pentads. That way, we can do a
  quick estimate for the number of melodies as a chord progression gets longer.
  */
  getAverageChordTonesInRange(chordType, lowerLimit, upperLimit) {
    var totalChordTones = 0, numChordTones, currentPitch;
    this.pitches.forEach(function(pitch) {
      currentPitch = pitch + chordType;
      numChordTones = AcMelody.getAllChordTones(currentPitch, lowerLimit, upperLimit).length;
      totalChordTones += numChordTones;
    });

    return this.round(totalChordTones / this.pitches.length, 3);
  }

  productOfSequence(arr) {
    var product = 1;
    arr.forEach(function(num) {
      product = product * num;
    });
    return product;
  }

  // lifted this from http://www.jacklmoore.com/notes/rounding-in-javascript/
  round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  }
};

var calc = new CalculationExploration();

console.log("===== Music Calculation Exploration =====");
console.log("Range is from Bb3 to B5\n\nAverage chord tones for");
console.log("- major triads: " + calc.getAverageChordTonesInRange("M", AcData.DEFAULT_LOWER_LIMIT, AcData.DEFAULT_UPPER_LIMIT));
console.log("- minor triads: " + calc.getAverageChordTonesInRange("m", AcData.DEFAULT_LOWER_LIMIT, AcData.DEFAULT_UPPER_LIMIT));
console.log("- maj7 chords: " + calc.getAverageChordTonesInRange("maj7", AcData.DEFAULT_LOWER_LIMIT, AcData.DEFAULT_UPPER_LIMIT));
console.log("- m7 chords: " + calc.getAverageChordTonesInRange("m7", AcData.DEFAULT_LOWER_LIMIT, AcData.DEFAULT_UPPER_LIMIT));
console.log("- dominant chords: " + calc.getAverageChordTonesInRange("7", AcData.DEFAULT_LOWER_LIMIT, AcData.DEFAULT_UPPER_LIMIT));
console.log("- maj9 chords: " + calc.getAverageChordTonesInRange("maj9", AcData.DEFAULT_LOWER_LIMIT, AcData.DEFAULT_UPPER_LIMIT))
console.log("- m9 chords: " + calc.getAverageChordTonesInRange("m9", AcData.DEFAULT_LOWER_LIMIT, AcData.DEFAULT_UPPER_LIMIT));

var chordTonesTriads = calc.getAverageChordTonesInRange("M", AcData.DEFAULT_LOWER_LIMIT, AcData.DEFAULT_UPPER_LIMIT);
var chordTonesTetrads = calc.getAverageChordTonesInRange("maj7", AcData.DEFAULT_LOWER_LIMIT, AcData.DEFAULT_UPPER_LIMIT);
var chordTonesPentads = calc.getAverageChordTonesInRange("maj9", AcData.DEFAULT_LOWER_LIMIT, AcData.DEFAULT_UPPER_LIMIT);

console.log("\nNumber of possible melodies for");
console.log("- 4 triads: " + Math.floor(Math.pow(chordTonesTriads, 4)));
console.log("- 8 triads: " + Math.floor(Math.pow(chordTonesTriads, 8)));
console.log("- 12 triads: " + Math.floor(Math.pow(chordTonesTriads, 12)));
console.log("- 4 tetrads: " + Math.floor(Math.pow(chordTonesTetrads, 4)));
console.log("- 8 tetrads: " + Math.floor(Math.pow(chordTonesTetrads, 8)));
console.log("- 12 tetrads: " + Math.floor(Math.pow(chordTonesTetrads, 12)));
console.log("- 4 pentads: " + Math.floor(Math.pow(chordTonesPentads, 4)));
console.log("- 8 pentads: " + Math.floor(Math.pow(chordTonesPentads, 8)));
console.log("- 12 pentads: " + Math.floor(Math.pow(chordTonesPentads, 12)));
console.log("\nNote that this doesn't account for simple filtering rules.");

var debugMessage3 = '';
debugMessage3 += 
