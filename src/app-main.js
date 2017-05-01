const React = require('react');
const ReactDOM = require('react-dom');
const moment = require('moment');

var AutoComposerLogic = require('./autocomposer-logic');
var AcLogic = new AutoComposerLogic.AutoComposerLogic();

var AutoComposerMelody = require('./autocomposer-melody');
var AcMelody = new AutoComposerMelody.AutoComposerMelody();

var acMidi = require('./autocomposer-midi');
var AcMidi = new acMidi.AutoComposerMidi();

var AcButton = require('./react/ac-button');
var AcToggleButton = require('./react/ac-toggle-button');
var AcTextArea = require('./react/ac-textarea');
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

    /**
    * @type {Object} - Data store. Any changes to this data store will not cause an update.
    */
    this.store = {
      melodies: [],
      chordProgressionClean: "",
      chordProgressionPlaceholder: AcLogic.INITIAL_PROGRESSION,
      MIN_SUPPORTED_WIDTH: 500
    };

    /**
    * @type {Object} - Component state. Changes to this will eventually trigger a render.
    */
    this.state = {
      showHelp: false,
      showControls: false,
      showOutput: false,

      debugMode: false,
      controlsDisabled: true, // While this is a mess, no need to show it.

      chordProgressionRaw: "",
      chordProgressionChanged: false,

      // This becomes true whenever we have a chord progression change, and the correct button is clicked.
      // Returns to false after output finishes rendering
      allowMelodyGeneration: "",
      melodyLoaded: false,

      isOnSupportedDevice: this._isOnSupportedDevice(),
      isViewportWidthSupported: this._isViewportWidthSupported()
    };

    this.handleChange = this.handleChange.bind(this);
    this.generateMelodies = this.generateMelodies.bind(this);
    this.outputFinishCallback = this.outputFinishCallback.bind(this);
    this.callbackChangeState = this.callbackChangeState.bind(this);
    this._resizeHandler = this._resizeHandler.bind(this);
    this.loadMusic = this.loadMusic.bind(this);

    this.playMelody = this.playMelody.bind(this);
    this.playMelodySolo = this.playMelodySolo.bind(this);
    this.stopMusic = this.stopMusic.bind(this);
    this.downloadMidi = this.downloadMidi.bind(this);
  }

  /**
  * Checks the device/browser. Returns true if the browser is supported.
  * Expected to run on loading the app.
  */
  _isOnSupportedDevice() {
    var ua = navigator.userAgent;
    // token explanation
    // android - not supporting mobile
    // trident - IE rendering engine. IE does not support the class JS keyword. Which is all over this codebase.
    var isSupportedDevice = ua.search(/android|trident/i) == -1;
    return isSupportedDevice;
  }

  /**
  * Checks the device/browser. Returns true if the app will display properly in the given device screen.
  * Expected to run when loading the app, and on window resize.
  */
  _isViewportWidthSupported() {
    if(window.innerWidth >= this.store.MIN_SUPPORTED_WIDTH) {
      return true;
    } else {
      return false
    }
  }

  /**
  * Handler for browser resize event.
  */
  _resizeHandler() {
    if(this._isViewportWidthSupported() && !this.state.isViewportWidthSupported) {
      // state transition: non-supported VW to a supported VW
      this.setState({isViewportWidthSupported: true});
    } else if (!this._isViewportWidthSupported() && this.state.isViewportWidthSupported) {
      // state transition: supported VW to a non-supported VW
      this.setState({isViewportWidthSupported: false});
    }
  }

  /**
  * Add event listener
  */
  componentDidMount() {
    window.addEventListener("resize", this._resizeHandler);
  }

  /**
  * Remove event listener
  */
  componentWillUnmount() {
    window.removeEventListener("resize", this._resizeHandler);
  }

  _sendStatusUpdate(message) {
    var updateEvent = new CustomEvent('statusUpdate', {detail: message});
    document.body.dispatchEvent(updateEvent);
  }

  /**
  * Changes app state. Meant to be called from child components
  * @param {string} stateKey - App state to change
  * @param {number|string|Object} newState - Assigns this to the state
  * @param {boolean} [useDataStore] - If true, the data store is changed instead of the state object.
  */
  callbackChangeState(stateKey, newState, useDataStore) {
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
    var melodyString = event.currentTarget.dataset["payload"];
    var melodiesData = melodyString.split(";");

    var melody1 = melodiesData[0].split(",");
    var melody2 = melodiesData[1].split(",");
    var melody3 = melodiesData[2].split(",");

    var melodies = [melody1, melody2, melody3];
    this.store.melodies = melodies;
    this.setState({melodyLoaded: true});

    var newSelectionEvent = new Event("newSelection");
    document.body.dispatchEvent(newSelectionEvent);
  }

  /**
  * Generates the melodies for the given chord progression.
  * @param {Object} event - React event
  */
  generateMelodies(event) {
    var chordProgression = this.state.chordProgressionRaw.trim().split(" ");

    if(!this.state.chordProgressionChanged || this.state.chordProgressionRaw.trim() === this.store.chordProgressionClean) {
      // Chord progression hasn't changed. No need to continue.
      console.debug("[AutoComposer.generateMelodies()] Chord progression hasn't changed. No generation for you.");
      return;
    }

    this.store.chordProgressionClean = this.state.chordProgressionRaw.trim();

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

      this._sendStatusUpdate("Generating melodies...");
      this.setState({showOutput: true, allowMelodyGeneration: true, melodyLoaded: false, showHelp: false});
      this.store.melodies = [];


      var newSelectionEvent = new Event("newSelection");
      document.body.dispatchEvent(newSelectionEvent);
    } catch(exc) {
      console.warn("[AutoComposer.generateMelodies()] " + exc.message + "\nError Type = " + exc.name);
      this._sendStatusUpdate("[ERROR] " + exc.message);
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
      var timestamp = moment().format("YYMMDDHHmmss");
      var fileName = "autocomposer_" + timestamp + "_" + this.state.chordProgressionRaw.replace(/\s+/g, "-");
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
    var chordProgressionArray = this.store.chordProgressionClean.split(" ");
    // Assume that we have an empty body tag.

    if(this.state.isOnSupportedDevice && this.state.isViewportWidthSupported) {
      return (
        <div id="app-container" className="root-panel">
          <div id="main-control-panel" className="ac-panel">

            <div className="panel-row">
              <div className="ac-control-wrapper flex-lg">
                <h1 id="main-title">AutoComposer</h1>
              </div>
            </div>

            <div className="panel-row">
              <p>
                This is a prototype for a program that automatically writes music. Click the <i className="fa fa-question"></i> button to get started.
                For more info, check out the <a href="https://github.com/rjsalvadorr/autocomposer-melody/wiki" target="_blank">project wiki</a> and <a href="https://github.com/rjsalvadorr/autocomposer-melody" target="_blank">repository</a>.
              </p>
            </div>

            <div className="panel-row has-labels">
              <AcTextArea inputKey="chordProgressionRaw" addClass="double-height" value={this.state.chordProgressionRaw} placeholder={this.store.chordProgressionPlaceholder} onChange={this.handleChange} />
              <AcButton inputKey="generateMelodies" inputLabel="Generate" wrapperAddClass="square" addClass="double-height blue" onClick={this.generateMelodies} isActive={!this.state.chordProgressionChanged}/>
            </div>

            <div className="panel-row">
              <AcButton inputKey="generateMelodies" icon="play" addClass="green" wrapperAddClass="flex-lg" onClick={this.playMelody} disabled={!this.state.melodyLoaded}/>
              <AcButton inputKey="generateMelodies" icon="play" addClass="green" inputLabel="Solo" wrapperAddClass="flex-sm" onClick={this.playMelodySolo} disabled={!this.state.melodyLoaded}/>
              <AcButton inputKey="generateMelodies" icon="stop" addClass="red" wrapperAddClass="flex-sm" onClick={this.stopMusic} disabled={!this.state.melodyLoaded}/>
              <AcButton inputKey="generateMelodies" icon="download" wrapperAddClass="flex-sm" onClick={this.downloadMidi} disabled={!this.state.melodyLoaded}/>
            </div>

            <div className="panel-row">
              <AcToggleButton inputKey="showHelp" icon="question" wrapperAddClass="flex-sm" isActive={this.state.showHelp} onClickHandler={this.callbackChangeState} />
              <AcToggleButton inputKey="showControls" icon="cog" wrapperAddClass="flex-sm" initialState={this.state.showControls} onClickHandler={this.callbackChangeState} disabled={this.state.controlsDisabled} />
            </div>

            <div className="panel-row">
              <StatusOutput inputKey="status-output" value="status output..." />
            </div>

            <DebugPanel isHidden={!this.state.debugMode} debugData={JSON.stringify(this.state, null, 2)}/>
          </div>

          <ControlPanel isShown={this.state.showControls} />

          <HelpPanel isShown={this.state.showHelp} />

          <OutputPanel isShown={this.state.showOutput} chordProgression={chordProgressionArray} allowMelodyGeneration={this.state.allowMelodyGeneration} outputCallback={this.outputFinishCallback} loadMelody={this.loadMusic} />

        </div>
      );
    } else {
      return (
        <div id="app-container" className="root-panel">
          <div id="not-supported-panel" className="ac-panel">
            <h1>Where's the AutoComposer?!</h1>
            <p>You're seeing this because your browser's window size is too small, or you're using a device that's not supported by the app.</p>
          </div>
        </div>
      );
    }
  }
}

ReactDOM.render(<AutoComposer />, document.getElementById('react-root'));
