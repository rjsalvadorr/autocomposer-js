var MidiWriter = require('midi-writer-js');
var MidiPlayer = require('midi-player-js');
var SoundfontPlayer = require('soundfont-player');
var tonalNote = require('tonal-note');

/**
 * Class responsible for playing audio and generating MIDI files for users.
 */
class AutoComposerMidi {
  constructor() {
    this.NUM_INSTRUMENTS = 3;

    this.player = null;
    this.audioContext = null;
    this.instrumentInit = 0;
    this.instrumentMelody = null;
    this.instrumentAccomp = null;
    this.instrumentBass = null;

    // is this kind of scope hackery necessary?!
    var haxThis = this;
    this.audioContext = new AudioContext;

    this.instrumentMelody = Soundfont.instrument(this.audioContext, 'violin', {soundfont: 'FluidR3_GM'}).then(function (sfInstrument) {
        haxThis._addInstrument();
    });
    this.instrumentAccomp = Soundfont.instrument(this.audioContext, 'acoustic_grand_piano', {soundfont: 'FluidR3_GM'}).then(function (sfInstrument) {
        haxThis._addInstrument();
    });
    this.instrumentBass = Soundfont.instrument(this.audioContext, 'acoustic_bass', {soundfont: 'FluidR3_GM'}).then(function (sfInstrument) {
        haxThis._addInstrument();
    });
  }

  _addInstrument() {
    this.instrumentInit++;
    if(this.instrumentInit === this.NUM_INSTRUMENTS) {
      this._initializePlayer();
    }
  }

  _midiCallback(event) {
    // callback for MIDI events
    console.debug(event);

    if (event.name == 'Note on' && event.velocity > 0) {
        switch(event.track) {
          case 1:
            this.instrumentMelody.play(event.noteName, this.audioContext.currentTime, {gain: 4});
          case 2:
            this.instrumentAccomp.play(event.noteName, this.audioContext.currentTime, {gain: 2});
          case 3:
            this.instrumentBass.play(event.noteName, this.audioContext.currentTime, {gain: 3});
          default:
            // nothing!
        }
    }
    if (event.name == 'Note off') {
      switch(event.track) {
        case 1:
          this.instrumentMelody.stop();
        case 2:
          this.instrumentAccomp.stop();
        case 3:
          this.instrumentBass.stop();
        default:
          // nothing!
      }
    }
    instrumentInit++;
  }

  _initializePlayer() {
    var inst1 = this.instrumentMelody;
    var inst2 = this.instrumentAccomp;
    var inst3 = this.instrumentBass;

    this.player = new MidiPlayer.Player(this._midiCallback);

    console.log("[AutoComposerMidi._initializePlayer()] Loading complete!");

    var loadEvent = new Event("midiPlayerReady");
    document.body.dispatchEvent(loadEvent);
  }

    /**
    * Builds MIDI info for a single note
    * @private
    * @param {number} numMidi - MIDI number for a pitch
    * @param {number} duration - MIDI number for a pitch
    * @param {number} wait
    * @return {MidiWriter.NoteEvent} - ???
    */
  _buildNoteMidi(numMidi, duration, wait) {
      if(!wait) {
          wait = "0";
      }
      return new MidiWriter.NoteEvent({pitch: [numMidi], duration: duration, wait: wait, velocity: 100});
  }

    /**
    * Builds MIDI info for a chord
    * @private
    * @param {number[]} arrNumMidi - MIDI numbers for a set of pitches
    * @param {number} duration - MIDI number for a pitch
    * @param {number} wait
    * @return {MidiWriter.NoteEvent} - ???
    */
  _buildChordMidi(arrNumMidi, duration, wait) {
      if(!wait) {
          wait = "0";
      }
      return new MidiWriter.NoteEvent({pitch: arrNumMidi, duration: duration, wait: wait, velocity: 100});
  }
    /**
    * Builds a Track from a given melody.
    * @private
    * @param {string[]} arrMelody - our melody!
    * @return {Track} - a MidiWriter Track
    */
  _buildMelodyTrack(arrMelody) {
    var returnTrack = new MidiWriter.Track();

    for(var i = 0; i < arrMelody.length; i++) {
      var midiNumber = tonalNote.midi(arrMelody[i]);
      returnTrack.addEvent(this._buildNoteMidi(midiNumber, "1"));
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
    tracks[0] = this._buildMelodyTrack(arrMelody);

    var write = new MidiWriter.Writer(tracks);
    console.log("AutoComposerMidi.[getMidiSolo()] " + write.dataUri());

    return write.dataUri();
  }

    /**
    * Gets the MIDI data for a given melody, with accompaniment.
    * @private
    * @param {string[]} arrMelody - main melody
    * @param {string[]} arrAcompanimentLine - accompaniment line
    * @param {string[]} arrBassLine - bass line
    * @return {string} - MIDI data, as a DataURI string.
    */
  _buildMelodyMidiWithAccompaniment(arrMelody, arrAcompaniment, arrBass) {
    var tracks, midiNumber;

    melodyTrack = this._buildMelodyTrack(arrMelody);
    melodyTrack.addInstrumentName("violin");

    accompanimentTrack = this._buildMelodyTrack(arrAcompanimentLine);
    accompanimentTrack.addInstrumentName("acoustic_grand_piano");

    bassTrack = this._buildMelodyTrack(arrBassLine);
    bassTrack.addInstrumentName("acoustic_bass");

    tracks = [melodyTrack, accompanimentTrack, arrBass];

    var write = new MidiWriter.Writer(tracks);
    console.log("AutoComposerMidi.[getMidiSolo()] " + write.dataUri());

    return write.dataUri();
  }

    /**
    * Plays the given melody.
    * @param {string[]} strMidi - MIDI data, as a DataURI string.
    */
  playMelodySolo(melodySolo) {
    var strMidi = this._buildMelodyMidiSolo(melodySolo);
    this._playMelody(strMidi);
  }
    /**
    * Plays the given melodies.
    * @param {string[]} strMidi - MIDI data, as a DataURI string.
    */
  playMelodyWithAccompaniment(melodySolo, melodyAccomp, melodyBass) {
    var strMidi = this._buildMelodyMidiWithAccompaniment(melodySolo, melodyAccomp, melodyBass);
    this._playMelody(strMidi);
  }

    /**
    * Actually plays the given melody
    * @private
    * @param {string} strMidi - MIDI data, as a DataURI string.
    */
  _playMelody(strMidi) {
    this.stopPlayback();
    this.player.loadDataUri(strMidi);
    this.player.play();
  }

    /**
    * Stops all playback
    */
  stopPlayback() {
    if(this.player.isPlaying()) {
        this.player.stop();
    }
  }
}

exports.AutoComposerMidi = AutoComposerMidi;
