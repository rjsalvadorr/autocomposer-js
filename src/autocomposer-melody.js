var tonal = require('tonal');
var ChordUnit = require('./chord-unit');
var MelodyUnit = require('./melody-unit');

var AutoComposerData = require('./autocomposer-data');
var AcData = new AutoComposerData.AutoComposerData();

/**
 * Creates melodies from a given chord progression
 */
class AutoComposerMelody {
  /**
  * @param {string[]} chordProgression - array of chord symbols
  * @param {string} lowerLimit - lower boundary note (in scientific notation)
  * @param {string} upperLimit - upper boundary note (in scientific notation)
  */
  constructor(chordProgression, lowerLimit, upperLimit) {
    /** @type {string[]} */
    this.chordProgression = chordProgression || AcData.INITIAL_PROGRESSION,
    /** @type {string} */
    this.lowerLimit = lowerLimit || AcData.DEFAULT_LOWER_LIMIT,
    /** @type {string} */
    this.upperLimit = upperLimit || AcData.DEFAULT_UPPER_LIMIT
  }

    /**
    * For a given note, find its lowest instance in the specified range.
    * @private
    * @param {string} note - note (written in scientific notation)
    * @param {string} upperLimit - note (written in scientific notation)
    * @param {string} lowerLimit - note (written in scientific notation)
    * @return {string[]} - an array of notes (written in scientific pitch)
    */
  getLowestNoteInRange(note, upperLimit, lowerLimit) {
    return [];
  }

    /**
    * For a given chord, get all the chord tones between the upper and lower limits.
    * @private
    * @param {string} chord - chord symbol
    * @param {string} lowerLimit - note (written in scientific notation)
    * @param {string} upperLimit - note (written in scientific notation)
    * @return {string[]} - an array of notes (written in scientific pitch)
    */
  getAllChordTones(chord, lowerLimit, upperLimit) {
    var chordTones = tonal.chord(chord);
    var chordTonesInRange = tonal.range.pitchSet(chordTones, [lowerLimit, upperLimit]);

    for(var i = 0; i < chordTonesInRange.length; i++) {
      for(var j = 0; j < chordTones.length; j++) {
        // Fixing pesky issue where D7 was returned as "D Gb A C" instead of "D F# A C"
        // If the current chord tone is enharmonic with the note from the pitch set,
        // Override it with the chord tone.
        if(tonal.note.pc(chordTonesInRange[i]) != chordTones[j]
          && tonal.note.enharmonics(chordTones[j]).indexOf(tonal.note.pc(chordTonesInRange[i])) > -1) {
          chordTonesInRange[i] = chordTones[j] + tonal.note.oct(chordTonesInRange[i]);
        }
      }
    }

    return chordTonesInRange;
  }

    /**
    * For a given chord symbol, creates a ChordUnit object
    * @private
    * @param {string} chord - chord symbol
    * @param {string} lowerLimit - note (in scientific notation)
    * @param {string} upperLimit - note (in scientific notation)
    * @return {ChordUnit}
    */
  buildChordUnit(chord, lowerLimit, upperLimit) {
    var chordTonesInRange = this.getAllChordTones(chord, lowerLimit, upperLimit);
    var chordUnit = new ChordUnit.ChordUnit(chord, chordTonesInRange, null);
    return chordUnit;
  }

    /**
    * For a given melody, creates a MelodyUnit object
    * @private
    * @param {string[]} chordProgression - a chord progression
    * @param {string} melodyString - a melody (in scientific notation)
    * @return {MelodyUnit}
    */
  buildMelodyUnit(chordProgression, melodyString) {
    var arrMelody = melodyString.split(" ");
    var melodyUnit = new MelodyUnit.MelodyUnit(chordProgression, arrMelody);
    return melodyUnit;
  }

    /**
    * For a given chord progression and melody, generate a series of melodies that fit over the progression
    * @private
    * @param {string[]} chordProgression - a chord progression
    * @param {string[]} rawMelodies - a string representing the melody
    * @param {Object} options - if true, generated melodies will be sorted, with smoothest melodies coming first.
    * @param {boolean} options.sort - if true, generated melodies will be sorted, with smoothest melodies coming first.
    * @param {number} options.limit - limits the output to a set number.
    * @return {MelodyUnit[]} - a list of ChordUnit objects.
    */
  buildMelodyUnitList(chordProgression, rawMelodies, options) {
    var melodyUnits = [];
    var haxThis = this;

    if(options && options.limit) {
      rawMelodies.splice(options.limit);
    }

    rawMelodies.forEach(function(rawMelody) {
      melodyUnits.push(haxThis.buildMelodyUnit(chordProgression, rawMelody));
    });

    if(options && options.sort) {
      melodyUnits.sort(function(a, b) {
        return a.smoothness - b.smoothness;
      });
    }

    return melodyUnits;
  }

    /**
    * For a given chord progression, generate a series of melodies that fit over the progression
    * @private
    * @param {string[]} chordProgression - chord symbols
    * @param {string} lowerLimit - lower limit (in scientific notation). Optional value.
    * @param {string} upperLimit - upper limit (in scientific notation). Optional value.
    * @return {ChordUnit[]} - a list of ChordUnit objects.
    */
  buildChordUnitList(chordProgression, lowerLimit, upperLimit) {
    if(lowerLimit == null) {
      lowerLimit = this.lowerLimit;
    }
    if(upperLimit == null) {
      upperLimit = this.upperLimit;
    }

    var chordUnitList = [];
    var chordTonesInRange;

    for(var i = chordProgression.length - 1; i >= 0; i--) {
      chordTonesInRange = this.getAllChordTones(chordProgression[i], lowerLimit, upperLimit);

      if(i === chordProgression.length) {
        chordUnitList[i] = new ChordUnit.ChordUnit(chordProgression[i], chordTonesInRange, null);
      } else {
        chordUnitList[i] = new ChordUnit.ChordUnit(chordProgression[i], chordTonesInRange, chordUnitList[i + 1]);
      }
    }

    return chordUnitList;
  }

    /**
    * Recursive function that adds new notes to the previous notes passed into it.
    * On the first call of this function, melodyList should be null.
    * @private
    * @param {ChordUnit} chordUnit - the ChordUnit for the next chord
    * @param {?string[]} melodyList - list of existing melodies
    * @param {Object} options - if true, generated melodies will be filtered
    * @param {boolean} options.filtered - if true, generated melodies will be filtered
    * @param {boolean} options.rawOutput - if true, generated melodies will be given as strings
    * @return {string[]} - a list of melodies. Each element is a string represeting a melody. Each melody string is written as a series of pitches delimited by a space.
    */
  getMelodiesCore(chordUnit, melodyList, options) {
    var returnList = [];
    var chordTones = chordUnit.chordTones;
    var rawMelody, newMelody;
    var haxThis = this;

    if(melodyList) {
      // We're somewhere along the middle of the chain.
      melodyList.forEach(function(currentMelody) {
        chordTones.forEach(function(currentChordTone) {
          newMelody = currentMelody + " " + currentChordTone;

          if(options.filtered) {
            if(AcData.filterMelodyRange(newMelody)) {
              returnList.push(newMelody);
            }
          } else {
            returnList.push(newMelody);
          }

        });
      });
    } else {
      // This is the beginning of the chain.
      melodyList = chordUnit.chordTones;
      returnList.push.apply(returnList, melodyList);
    }

    if(chordUnit.nextChordUnit) {
      // We're somewhere along the middle of the chain.
      return this.getMelodiesCore(chordUnit.nextChordUnit, returnList, options);
    } else {
      // End of the chain.
      return returnList;
    }
  }

    /**
    * For a given chord progression, generate a series of melodies that fit over the progression.
    * @param {string[]} chordProgression - chord progression given by user
    * @return {MelodyUnit[]} - an array of notes (written in scientific pitch)
    */
  getAllMelodies(chordProgression) {
    var chordUnitList = this.buildChordUnitList(chordProgression, this.lowerLimit, this.upperLimit);
    var melodies = this.getMelodiesCore(chordUnitList[0], null, {filtered: false});

    var melodyUnits = [];
    var haxThis = this;
    melodies.forEach(function(rawMelody) {
      melodyUnits.push(haxThis.buildMelodyUnit(chordProgression, rawMelody));
    });

    return melodyUnits;
  }

    /**
    * For a given chord progression, generate a series of melodies that fit over the progression.
    * @param {string[]} chordProgression - chord progression given by user
    * @return {string[]} - an array of notes (written in scientific pitch)
    */
  getRawMelodies(chordProgression) {
    var chordUnitList = this.buildChordUnitList(chordProgression, this.lowerLimit, this.upperLimit);
    var melodies = this.getMelodiesCore(chordUnitList[0], null, {filtered: true, rawOutput: true});

    return melodies;
  }

    /**
    * For a given chord progression, generate a series of melodies that fit over the progression.
    * Currently, the melodies are sorted by smoothness, and are limited to the first 100 melodies.
    * @param {string[]} chordProgression - chord progression given by user
    * @return {MelodyUnit[]} - an array of MelodyUnits
    */
  getMelodies(chordProgression) {
    var chordUnitList = this.buildChordUnitList(chordProgression, this.lowerLimit, this.upperLimit);
    var rawMelodies = this.getMelodiesCore(chordUnitList[0], null, {filtered: true});
    var options = {sort: true, limit: AcData.NUM_MELODIES_LIMIT};

    var melodyUnits = this.buildMelodyUnitList(chordProgression, rawMelodies, options);

    return melodyUnits;
  }

};

exports.AutoComposerMelody = AutoComposerMelody;
