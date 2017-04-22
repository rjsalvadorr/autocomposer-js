

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
    return false;
  }

    /**
    * Converts ASCII accidentals to Unicode accidentals in HTML
    * @param {string} input - text with ASCII accidentals
    * @return {string} - text with Unicode accidentals in HTML
    */
  convertAsciiAccidentalsToHtml(input) {
    return "not implemented yet";
  }

    /**
    * Converts ASCII accidentals to Unicode accidentals
    * @param {string} input - text with ASCII accidentals
    * @return {string} - text with Unicode accidentals
    */
  convertAsciiAccidentalsToText(input) {
    return "not implemented yet";
  }

    /**
    * Converts Unicode accidentals to ASCII
    * @param {string} input - text with Unicode accidentals
    * @return {string} - text with ASCII accidentals
    */
  convertAccidentalsToAscii(input) {
    return "not implemented yet";
  }
}

exports.AutoComposerParser = AutoComposerParser;
