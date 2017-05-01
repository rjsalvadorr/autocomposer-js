var tonal = require('tonal');
var ChordUnit = require('./chord-unit');
var MelodyUnit = require('./melody-unit');

var AutoComposerLogic = require('./autocomposer-logic');
var AcLogic = new AutoComposerLogic.AutoComposerLogic();

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
    this.chordProgression = chordProgression || AcLogic.INITIAL_PROGRESSION;
    /** @type {string} */
    this.lowerLimit = lowerLimit || AcLogic.DEFAULT_LOWER_LIMIT;
    /** @type {string} */
    this.upperLimit = upperLimit || AcLogic.DEFAULT_UPPER_LIMIT;
  }

  _sendStatusUpdate(message) {
    var updateEvent = new CustomEvent('statusUpdate', {detail: message});
    document.body.dispatchEvent(updateEvent);
  }

    /**
    * For a given note, find its lowest instance in the specified range.
    * @private
    * @param {string} pitch - pitch class
    * @param {string} lowerLimit - note (written in scientific notation)
    * @param {string} upperLimit - note (written in scientific notation)
    * @return {string[]} - an array of notes (written in scientific pitch)
    */
  _getLowestNoteInRange(pitch, lowerLimit, upperLimit) {
    var chordTonesInRange = tonal.range.pitchSet(pitch, [lowerLimit, upperLimit]);
    return chordTonesInRange[0];
  }

    /**
    * For a given array of chord tones, remove the specified pitches.
    * @private
    * @param {string[]} pitchArray - pitches to remove
    * @param {string[]} chordTones - chord tones
    * @return {string[]} - the remaining chord tones
    */
  _removePitchesFromChordTones(pitchArray, chordTones) {
    var indexToRemove;
    pitchArray.forEach(function(pitch) {
      indexToRemove = chordTones.indexOf(pitch);
      if (indexToRemove > -1) {
        chordTones.splice(indexToRemove, 1);
      }
    });
    return chordTones;
  }

    /**
    * For a given MelodyUnit, get an accompaniment for it.
    * @private
    * @param {MelodyUnit} melodyUnit - melody that needs accompaniment
    * @return {string[]} - array of strings, each representing one or more notes to play under each melodic note.
    */
  getAccompaniment(melodyUnit) {
    // Omit root note, and maybe avoid doubling the top note as well.
    var noteArray = [], chordNotes, currentChord, bassPitch, topPitch;

    for(var i = 0; i < melodyUnit.chordProgression.length; i++) {
      currentChord = melodyUnit.chordProgression[i];
      bassPitch = tonal.chord.parse(currentChord)["tonic"];
      topPitch =  tonal.note.pc(melodyUnit.melodyNotes[i]);

      chordNotes = tonal.chord.notes(currentChord);
      chordNotes = this._removePitchesFromChordTones([bassPitch, topPitch], chordNotes);

      for(var j = 0; j < chordNotes.length; j++) {
        chordNotes[j] = this._getLowestNoteInRange(chordNotes[j], AcLogic.ACCOMPANIMENT_LOWER_LIMIT, AcLogic.ACCOMPANIMENT_UPPER_LIMIT);
      }
      noteArray.push(chordNotes.join(" "));
    }

    return noteArray;
  }

    /**
    * For a given MelodyUnit, return a basic bass line consisting only of root notes.
    * @private
    * @param {MelodyUnit} melodyUnit - melody that needs a bassline
    * @return {string} - string representing a bassline.
    */
  getBasicBassLine(melodyUnit) {
    var noteArray = [], currentChord, bassPitch, bassNote;

    // return all the lowest root notes for the progression.
    for(var i = 0; i < melodyUnit.chordProgression.length; i++) {
      currentChord = melodyUnit.chordProgression[i];
      bassPitch = tonal.chord.parse(currentChord)["tonic"];
      bassNote = this._getLowestNoteInRange(bassPitch, AcLogic.BASS_LOWER_LIMIT, AcLogic.BASS_UPPER_LIMIT);

      noteArray.push(bassNote);
    }

    return noteArray;
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

    rawMelodies.forEach(function(rawMelody) {
      melodyUnits.push(haxThis.buildMelodyUnit(chordProgression, rawMelody));
    });

    if(options) {
      if(options.sort) {
        melodyUnits.sort(function(a, b) {
          return a.smoothness - b.smoothness;
        });
      }

      if(options.limit) {
        melodyUnits.splice(options.limit);
      }
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
    var currentMelody, currentChordTone;
    var rawMelody, newMelody, isInRange;
    var isNotRepetitive, timestamp, haxThis = this;

    if(melodyList) {
      // We're somewhere along the middle of the chain.
      for(var i = 0; i < melodyList.length; i++) {
        currentMelody = melodyList[i];

        for(var j = 0; j < chordTones.length; j++) {
          currentChordTone = chordTones[j];

          if(melodyList.length > 10000) {
            timestamp = new Date().valueOf().toString().slice(-8);
            if(timestamp % 8 === 0) {
              // Randomly skips generation every now and then.
              // Removes 20% of results?
              break;
            }
          }

          newMelody = currentMelody + " " + currentChordTone;

          if(options.filtered) {
            // check the distance of the last note and the new chord tone
            // if it's more than an octave, skip this.
            isInRange = AcLogic.filterMelodyRange(newMelody);
            if(!isInRange) {
              break;
            }

            if(newMelody.split(" ").length >= 3) {
              // check if melody is too repetitive. For our purposes, three of the same notes in a row
              // would be too repetitive.
              isNotRepetitive =  AcLogic.filterRepetition(newMelody);
            } else {
              isNotRepetitive = true;
            }
            if(!isNotRepetitive) {
              break;
            }

            returnList.push(newMelody);
          } else {
            returnList.push(newMelody);
          }
        }
      }
    } else {
      // This is the beginning of the chain.
      melodyList = chordUnit.chordTones;
      returnList.push.apply(returnList, melodyList);
    }

    if(chordUnit.nextChordUnit) {
      // We're somewhere before the end of the chain.
      return this.getMelodiesCore(chordUnit.nextChordUnit, returnList, options);
    } else {
      // End of the chain.
      if(options.filtered && returnList.length > AcLogic.NUM_MELODIES_LIMIT) {
        this._sendStatusUpdate("Generated  " + returnList.length + " melodies. Creating list of " + AcLogic.NUM_MELODIES_LIMIT + "...");
      } else {
        this._sendStatusUpdate("Generated  " + returnList.length + " melodies.");
      }
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
    var options = {sort: true, limit: AcLogic.NUM_MELODIES_LIMIT};

    var melodyUnits = this.buildMelodyUnitList(chordProgression, rawMelodies, options);

    return melodyUnits;
  }

};

exports.AutoComposerMelody = AutoComposerMelody;
