const React = require('react');
const ReactDOM = require('react-dom');

var AutoComposerLogic = require('./autocomposer-logic');
var AcLogic = new AutoComposerLogic.AutoComposerLogic();

var AutoComposerMelody = require('./autocomposer-melody');
var AcMelody = new AutoComposerMelody.AutoComposerMelody();

var acMidi = require('./autocomposer-midi');
var AcMidi = new acMidi.AutoComposerMidi();

var AcButton = require('./react/ac-button');
var AcToggleButton = require('./react/ac-toggle-button');
var AcTextField = require('./react/ac-text-field');
var AcTextArea = require('./react/ac-textarea');
var AcSelect = require('./react/ac-select');
var AcRadioSet = require('./react/ac-radioset');
var AcCheckbox = require('./react/ac-checkbox');
var ErrorMessage = require('./react/error-message');
var StatusOutput = require('./react/status-output')

var HelpPanel = require('./react/help-panel');
var DebugPanel = require('./react/debug-panel');
var OutputPanel = require('./react/output-panel');
var ControlPanel = require('./react/control-panel');



function AcInputException(message) {
   this.message = message;
   this.name = 'AcInputException';
}



/**
* The core React component for the web app.
*/
class AutoComposer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showHelp: false,
      showControls: false,
      showOutput: false,
      showError: false,

      debugMode: false,
      controlsDisabled: true, // While this is a mess, no need to show it.

      chordProgressionRaw: "",
      chordProgressionChanged: false,

      errorMessage: "",

      // This becomes true whenever we have a chord progression change, and the correct button is clicked.
      // Returns to false after output finishes rendering
      allowMelodyGeneration: "",
      melodyLoaded: false
    };

    /**
    * @type {Object} - Data store. Any changes to this data store will not cause an update.
    */
    this.store = {
      melodies: [],
      chordProgressionPlaceholder: AcLogic.INITIAL_PROGRESSION,
    };

    this.handleChange = this.handleChange.bind(this);
    this.generateMelodies = this.generateMelodies.bind(this);
    this.outputFinishCallback = this.outputFinishCallback.bind(this);
    this.callbackChangeState = this.callbackChangeState.bind(this);
    this.loadMusic = this.loadMusic.bind(this);

    this.playMelody = this.playMelody.bind(this);
    this.playMelodySolo = this.playMelodySolo.bind(this);
    this.stopMusic = this.stopMusic.bind(this);
    this.downloadMidi = this.downloadMidi.bind(this);
  }

  /**
  * Changes app state. Meant to be called from child components
  * @param {string} stateKey - App state to change
  * @param {number|string|Object} newState - Assigns this to the state
  * @param {boolean} [useDataStore] - If true, the data store is changed instead of the state object.
  */
  callbackChangeState(stateKey, newState, useDataStore) {
    console.debug("app callbackChangeState()");

    if(useDataStore) {
      this.store[stateKey] = newState;
    } else {
      var stateObj = function() {
        var returnObj = {};

        returnObj[stateKey] = newState;

        return returnObj;
      }.bind(this)();

      this.setState(stateObj);
    }
  }

  /**
  * Changes app state. Meant to be called from child components.
  * Older function, compared to callbackChangeState()
  * @param {Object} event - React event
  */
  handleChange(event) {
    console.debug("app handleChange()");
    var stateObj = function() {
      var stateKey = this.target.dataset["stateKey"];
      var returnObj = {};

      if(this.target.type === "checkbox") {
        returnObj[stateKey] = this.target.checked;
      } else if(this.target.type === "button") {
        returnObj[stateKey] = this.target.dataset["currentState"] === "true";
      } else {
        returnObj[stateKey] = this.target.value;

        if(stateKey === "chordProgressionRaw") {
          returnObj["chordProgressionChanged"] = true;
        }
      }

      return returnObj;
    }.bind(event)();

    this.setState(stateObj);
  }

  /**
  * Loads melody data into the App. Meant to be used as a callback from the results table.
  * @param {Object} event - React event
  */
  loadMusic(event) {
    console.debug("app loadMusic()");
    var melodyString = event.target.dataset["payload"];
    var melodiesData = melodyString.split(";");

    var melody1 = melodiesData[0].split(",");
    var melody2 = melodiesData[1].split(",");
    var melody3 = melodiesData[2].split(",");

    var melodies = [melody1, melody2, melody3];
    this.store.melodies = melodies;
    this.setState({melodyLoaded: true})
  }

  /**
  * Generates the melodies for the given chord progression.
  * @param {Object} event - React event
  */
  generateMelodies(event) {
    var chordProgression = this.state.chordProgressionRaw.trim().split(" ");

    if(!this.state.chordProgressionChanged) {
      // Chord progression hasn't changed. No need to continue.
      console.debug("[AutoComposer.generateMelodies()] Chord progression hasn't changed. No generation for you.");
      return;
    }

    try {
      if(this.state.chordProgressionRaw == null || this.state.chordProgressionRaw == "") {
        throw new AcInputException('Chord input is empty!');
      }

      chordProgression.forEach(function(currentChordInput) {
        if(!AcLogic.isValidText(currentChordInput)) {
          throw new AcInputException('Chord input \'' + currentChordInput + '\' is not formatted properly! You should check the chord dictionary in the Help! section.');
        }
      });

      if(chordProgression.length < 2) {
        throw new AcInputException('You need to enter more chords. Two chords in a row is a completely valid input.');
      }

      this.setState({showError: false, showOutput: true, allowMelodyGeneration: true});
    } catch(exc) {
      console.warn("[AutoComposer.generateMelodies()] " + exc.message + "\nError Type = " + exc.name);
      this.setState({showError: true, errorMessage: exc.message});
    }
  }

  /**
  * Plays the loaded melody
  * @param {Object} event - React event
  */
  playMelody(event) {
    if(this.store.melodies.length > 0) {
      AcMidi.playMelodyWithAccompaniment(this.store.melodies[0], this.store.melodies[1], this.store.melodies[2]);
    }
  }

  /**
  * Plays the loaded melody by itself
  * @param {Object} event - React event
  */
  playMelodySolo(event) {
    if(this.store.melodies.length > 0) {
      AcMidi.playMelodySolo(this.store.melodies[0]);
    }
  }

  /**
  * Stops all music currently playing.
  * @param {Object} event - React event
  */
  stopMusic(event) {
    AcMidi.stopPlayback();
  }

  /**
  * Creates and sends MIDI data to the user.
  * @param {Object} event - React event
  */
  downloadMidi(event) {
    if(this.store.melodies.length > 0) {
      //download MIDI file
      var dataString = AcMidi.buildMelodyMidiWithAccompaniment(this.store.melodies[0], this.store.melodies[1], this.store.melodies[2]);
      var timestamp = new Date().valueOf().toString().slice(-8)

      var fileName = "autocomposer-" + timestamp + "_" + this.store.melodies[0].join("-");
      download(dataString, fileName, "audio/midi");
    }
  }

  /**
  * Callback that runs when output panel is finished rendering.
  * Prevents melody generation until the user enters a new progression.
  * @param {Object} event - React event
  */
  outputFinishCallback() {
    this.setState({allowMelodyGeneration: false, chordProgressionChanged: false});
  }

  render() {
    var chordProgressionArray = this.state.chordProgressionRaw.split(" ");
    // Assume that we have an empty body tag.
    return (
      <div id="app-container" className="root-panel">
        <div id="main-control-panel" className="ac-panel">
          <h3>AutoComposer</h3>

          <div className="panel-row has-labels">
            <AcTextArea inputKey="chordProgressionRaw" addClass="double-height" value={this.state.chordProgressionRaw} placeholder={this.store.chordProgressionPlaceholder} onChange={this.handleChange} />
            <AcButton inputKey="generateMelodies" inputLabel="Generate!" wrapperAddClass="square" addClass="double-height blue" onClick={this.generateMelodies} isActive={!this.state.chordProgressionChanged}/>
          </div>

          <div className="panel-row">
            <AcToggleButton inputKey="showControls" icon="cog" initialState={this.state.showControls} onClickHandler={this.callbackChangeState} disabled={this.state.controlsDisabled} />
            <AcToggleButton inputKey="showHelp" icon="question" initialState={this.state.showHelp} onClickHandler={this.callbackChangeState} />
          </div>

          <div className="panel-row">
            <AcButton inputKey="generateMelodies" icon="play" addClass="green" wrapperAddClass="flex-lg" onClick={this.playMelody} disabled={!this.state.melodyLoaded}/>
            <AcButton inputKey="generateMelodies" icon="play" addClass="green" inputLabel=" (Solo)" wrapperAddClass="flex-sm" onClick={this.playMelodySolo} disabled={!this.state.melodyLoaded}/>
            <AcButton inputKey="generateMelodies" icon="stop" addClass="red" wrapperAddClass="flex-sm" onClick={this.stopMusic} disabled={!this.state.melodyLoaded}/>
            <AcButton inputKey="generateMelodies" icon="download" wrapperAddClass="flex-sm" onClick={this.downloadMidi} disabled={!this.state.melodyLoaded}/>
          </div>

          <div className="panel-row">
            <StatusOutput inputKey="status-output" value="status output..." />
          </div>

          <ErrorMessage isShown={this.state.showError} errorMessage={this.state.errorMessage} />

          <DebugPanel isHidden={!this.state.debugMode} debugData={JSON.stringify(this.state, null, 2)}/>
        </div>

        <ControlPanel isShown={this.state.showControls} />

        <HelpPanel isShown={this.state.showHelp} />

        <OutputPanel isShown={this.state.showOutput} chordProgression={chordProgressionArray} allowMelodyGeneration={this.state.allowMelodyGeneration} outputCallback={this.outputFinishCallback} loadMelody={this.loadMusic} />

      </div>
    );
  }
}

ReactDOM.render(<AutoComposer />, document.getElementById('react-root'));
