var chord = require('tonal-chord');
var note = require('tonal-note');

/**
 * AutoComposerParser - determines if user input represents a valid note/chord.
 * Also handles conversions between proper accidental signs and ASCII accidentals like "b" or "#".
 */
class AutoComposerParser {
  constructor() {
      //
  }
    /**
    * Parses text, and determines if user input represents a valid note/chord.
    * @param {string} input - value given by the user
    * @return {boolean} - a true value means the string can be used by the rest of the program.
    */
  isValidText(input) {
    var isChord = chord.isKnownChord(input) ? true : false;
    var isNote = note.name(input) ? true : false;

    return isChord || isNote;
  }

    /**
    * Converts ASCII accidentals to Unicode accidentals in HTML
    * @param {string} input - text with ASCII accidentals
    * @return {string} - text with Unicode accidentals in HTML
    */
  convertAsciiAccidentalsToHtml(input) {
    var out = input.replace(/([A-G0-9])b/g, '$1&#9837;');
    out = out.replace(/([A-G0-9])#/g, '$1&#9839;');
    out = out.replace(/([A-G0-9])o/g, '$1&‌deg;');

    return out;
  }

    /**
    * Converts ASCII accidentals to Unicode accidentals
    * @param {string} input - text with ASCII accidentals
    * @return {string} - text with Unicode accidentals
    */
  convertAsciiAccidentalsToText(input) {
    var out = input.replace(/([A-G0-9])b/g, '$1♭');
    out = out.replace(/([A-G0-9])#/g, '$1♯');
    out = out.replace(/([A-G0-9])o/g, '$1°');

    return out;
  }

    /**
    * Converts Unicode accidentals to ASCII
    * @param {string} input - text with Unicode accidentals
    * @return {string} - text with ASCII accidentals
    */
  convertAccidentalsToAscii(input) {
    var out = input.replace(/([A-G0-9])♭/g, '$1b');
    out = out.replace(/([A-G0-9])♯/g, '$1#');
    out = out.replace(/([A-G0-9])°/g, '$1o');

    return out;
  }
}

exports.AutoComposerParser = AutoComposerParser;
