// For calculating big numbers, and possible ways to optimize the application.

var AutoComposerData = require('../../src/autocomposer-logic');
var AcLogic = new AutoComposerData.AutoComposerData();

var AutoComposerMelody = require('../../src/autocomposer-melody');
var AcMelody = new AutoComposerMelody.AutoComposerMelody();

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
    if(lowerLimit == null || typeof lowerLimit == 'undefined') {
      lowerLimit = AcLogic.DEFAULT_LOWER_LIMIT
    }

    if(upperLimit == null || typeof upperLimit == 'undefined') {
      upperLimit = AcLogic.DEFAULT_UPPER_LIMIT
    }

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

exports.CalculationExploration = new CalculationExploration();
