var MidiWriter = require('midi-writer-js');
var MidiPlayer = require('midi-player-js');
var SoundfontPlayer = require('soundfont-player');
var tonalNote = require('tonal-note');

/**
 * Class responsible for playing audio and generating MIDI files for users.
 */
class AutoComposerMidi {
  constructor() {
    this.INSTRUMENT_NAMES = ["violin", "acoustic_grand_piano", "acoustic_bass"];
    this.INSTRUMENT_GAIN = {
      violin: 1.75,
      acoustic_grand_piano: 1.5,
      acoustic_bass: 1.66
    }
    this.NOTE_DURATION = "1";

    this.instruments = {};
    this.player = null;
    this.audioContext = null;
    this.instrumentInit = 0;
    this.instrumentMelody = null;
    this.instrumentAccomp = null;
    this.instrumentBass = null;
    this.audioContext = new AudioContext;

    this.initialized = false;
    // Added this flag to fix an issue where notes randomly play again after the track ends.
    // It only works for tracks that are all the same length. If we ever have to play tracks that have
    // different lengths, we'll need a different solution.
    this.playbackLocked = true;

    // is this kind of scope hackery necessary?!
    var haxThis = this;

    for(var i = 0; i < this.INSTRUMENT_NAMES.length; i++) {
      // initialize each instrument
      Soundfont.instrument(this.audioContext, this.INSTRUMENT_NAMES[i], {soundfont: 'FluidR3_GM'}).then(function (sfInstrument) {
        console.log(sfInstrument);
        haxThis.instruments[sfInstrument.name] = sfInstrument;
        haxThis.instrumentInit++;

        if(haxThis.instrumentInit === haxThis.INSTRUMENT_NAMES.length) {
          haxThis._finishLoad();
        }
      });
    }

  }

    /**
    * Triggers the note playing for all instruments. Called for every MIDI event in the app.
    * @private
    * @param {number} event - MIDI event
    */
  _midiCallback(event) {
    // callback for MIDI events
    // console.debug(event);

    var instr1 = this.instruments["violin"];
    var instr2 = this.instruments["acoustic_grand_piano"];
    var instr3 = this.instruments["acoustic_bass"];

    if (!this.playbackLocked && event.name == 'Note on' && event.velocity > 0) {
        switch(event.track) {
          case 1:
            instr1.play(event.noteName, this.audioContext.currentTime, {gain: this.INSTRUMENT_GAIN["violin"]});
            break;
          case 2:
            instr2.play(event.noteName, this.audioContext.currentTime, {gain: this.INSTRUMENT_GAIN["acoustic_grand_piano"]});
            break;
          case 3:
            instr3.play(event.noteName, this.audioContext.currentTime, {gain: this.INSTRUMENT_GAIN["acoustic_bass"]});
            break;
          default:
            // nothing!
        }
    }

    if (event.name == 'Note off') {
      switch(event.track) {
        case 1:
          instr1.stop();
          break;
        case 2:
          instr2.stop();
          break;
        case 3:
          instr3.stop();
          break;
        default:
          // nothing!
      }
    }

    if (event.name == "End of Track") {
      this.playbackLocked = true;
    }
  }

    /**
    * Completes the loading of this class. The "midiPlayerReady" eve
    * @private
    * @emits {midiPlayerReady} - Emits this event when the audio player successfully loads
    */
  _finishLoad() {
    var haxThis = this;
    this.player = new MidiPlayer.Player(function(event) {
      haxThis._midiCallback(event);
    });
    this.initialized = true;
    this.playbackLocked = false;
    console.log("[AutoComposerMidi._initializePlayer()] Loading complete!");

    var loadEvent = new Event("midiPlayerReady");
    document.body.dispatchEvent(loadEvent);
  }

    /**
    * Builds MIDI info for a note or chord
    * @private
    * @param {number[]} arrNumMidi - MIDI numbers for a set of pitches
    * @param {number} duration - MIDI number for a pitch
    * @param {number} wait
    * @return {MidiWriter.NoteEvent} - ???
    */
  _buildMidi(arrNumMidi, duration, wait) {
      if(!wait) {
          wait = "0";
      }
      return new MidiWriter.NoteEvent({pitch: arrNumMidi, duration: duration, wait: wait, velocity: 100});
  }

    /**
    * Builds a Track from a given chord.
    * @private
    * @param {string[]} arrChordNotes - chordNotes
    * @return {Track} - a MidiWriter Track
    */
  _buildTrack(arrChordNotes) {
    var notes, midiNumber, midiNumbers;
    var returnTrack = new MidiWriter.Track();

    for(var i = 0; i < arrChordNotes.length; i++) {
      midiNumbers = [];
      notes = arrChordNotes[i].split(" ");

      notes.forEach(function(note){
        midiNumbers.push(tonalNote.midi(note));
      })

      returnTrack.addEvent(this._buildMidi(midiNumbers, this.NOTE_DURATION));
    }

    return returnTrack;
  }

    /**
    * Gets the MIDI data for a given melody.
    * @private
    * @param {string[]} arrMelody - our melody
    * @return {string} - MIDI data, as a DataURI string
    */
  _buildMelodyMidiSolo(arrMelody) {
    var tracks = [], midiNumber;
    //tracks[0] = this._buildMelodyTrack(arrMelody);
    tracks[0] = this._buildTrack(arrMelody);

    var write = new MidiWriter.Writer(tracks);
    console.log("[AutoComposerMidi._buildMelodyMidiSolo()] " + write.dataUri());

    return write.dataUri();
  }

    /**
    * Gets the MIDI data for a given melody, with accompaniment.
    * @param {string[]} arrMelody - main melody
    * @param {string[]} arrAcompanimentLine - accompaniment line
    * @param {string[]} arrBassLine - bass line
    * @return {string} - MIDI data, as a DataURI string.
    */
  buildMelodyMidiWithAccompaniment(arrMelody, arrAcompanimentLine, arrBassLine) {
    var tracks, midiNumber;

    //var melodyTrack = this._buildMelodyTrack(arrMelody);
    var melodyTrack = this._buildTrack(arrMelody);
    melodyTrack.addInstrumentName("violin");

    var accompanimentTrack = this._buildTrack(arrAcompanimentLine);
    accompanimentTrack.addInstrumentName("acoustic_grand_piano");

    //var bassTrack = this._buildMelodyTrack(arrBassLine);
    var bassTrack = this._buildTrack(arrBassLine);
    bassTrack.addInstrumentName("acoustic_bass");

    tracks = [melodyTrack, accompanimentTrack, bassTrack];

    var write = new MidiWriter.Writer(tracks);
    console.log("[AutoComposerMidi.buildMelodyMidiWithAccompaniment()] " + write.dataUri());

    return write.dataUri();
  }

    /**
    * Plays the given melody.
    * @param {string[]} melodySolo - solo melody (violin)
    */
  playMelodySolo(melodySolo) {
    var strMidi = this._buildMelodyMidiSolo(melodySolo);
    this._playMelody(strMidi);
  }
    /**
    * Plays the given melodies.
    * @param {string[]} melodySolo - solo melody (violin)
    * @param {string[]} melodyAccomp - accompaniment melody (piano)
    * @param {string[]} melodyBass - bass melody (bass)
    */
  playMelodyWithAccompaniment(melodySolo, melodyAccomp, melodyBass) {
    var strMidi = this.buildMelodyMidiWithAccompaniment(melodySolo, melodyAccomp, melodyBass);
    this._playMelody(strMidi);
  }

    /**
    * Actually plays the given melody
    * @private
    * @param {string} strMidi - MIDI data, as a DataURI string.
    */
  _playMelody(strMidi) {
    if(this.initialized) {
      this.stopPlayback();
      this.playbackLocked = false;
      this.player.loadDataUri(strMidi);
      this.player.play();
    } else {
      console.debug("[AutoComposerMidi._playMelody()] Player isn't initialized yet...");
    }
  }

    /**
    * Stops all playback
    */
  stopPlayback() {
    this.instruments["violin"].stop();
    this.instruments["acoustic_grand_piano"].stop();
    this.instruments["acoustic_bass"].stop();
    this.player.stop();
  }
}

exports.AutoComposerMidi = AutoComposerMidi;
