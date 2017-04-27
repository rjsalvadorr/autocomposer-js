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



function AcInputException(message) {
   this.message = message;
   this.name = 'AcInputException';
}



class OutputPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      melodyUnitList: null
    }

    this.playMelodySolo = this.playMelodySolo.bind(this);
    this.playMelody = this.playMelody.bind(this);
    this.stopPlayback = this.stopPlayback.bind(this);
    this.downloadMidi = this.downloadMidi.bind(this);
  }

  playMelodySolo(event) {
    var melodyString = event.target.dataset["payload"];
    console.debug(melodyString);
    var melody = melodyString.split(",");

    AcMidi.playMelodySolo(melody);
  }

  playMelody(event) {
    // melodyString looks like:
    // G5 F#5 G5;B2,A2,E3;E1 D2 C2
    var melodyString = event.target.dataset["payload"];
    var melodiesData = melodyString.split(";");
    console.debug(melodyString);

    var melody1 = melodiesData[0].split(",");
    var melody2 = melodiesData[1].split(",");
    var melody3 = melodiesData[2].split(",");

    AcMidi.playMelodyWithAccompaniment(melody1, melody2, melody3);
  }

  stopPlayback() {
    AcMidi.stopPlayback();
  }

  downloadMidi(event) {
    //download MIDI file
    var melodyString = event.target.dataset["payload"];
    var melodiesData = melodyString.split(";");

    var melody1 = melodiesData[0].split(",");
    var melody2 = melodiesData[1].split(",");
    var melody3 = melodiesData[2].split(",");

    var dataString = AcMidi.buildMelodyMidiWithAccompaniment(melody1, melody2, melody3);
    var timestamp = new Date().valueOf().toString().slice(-8)

    var fileName = "autocomposer-" + timestamp + "_" + melody1.join("-");
    download(dataString, fileName, "audio/midi");
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.allowMelodyGeneration) {
      console.debug("[OutputPanel.shouldComponentUpdate()] Component is updating...");
      return true;
    } else {
      return false;
    }
  }

  componentWillReceiveProps(nextProps, nextState){
    if(nextProps.allowMelodyGeneration) {
      console.debug("[OutputPanel.componentWillReceiveProps()] Generating melodies...");
      var chordProgression = this.props.chordProgression;
      this.setState({melodyUnitList: AcMelody.getMelodies(chordProgression)});
    }
  }

  componentDidUpdate() {
    window.VexTabDiv.Div.start();
    this.props.outputCallback();
  }

  createVexTab(arrChords, arrMelody) {
    var vtString, pitchClass;
    var vexTabText = "options scale=0.9 space=5 font-size=15 font-face=Times\n";
    vexTabText += "tabstave\n";
    vexTabText += "notation=true tablature=false\n";
    vexTabText += "notes :w ";

    arrMelody.forEach(function(melodyNote) {
      // Turns a note name like "C#4" into "C#/4 |"
      // Or "Bb4" into "B@/4 |"
      // VexTab notation sure is odd.
      pitchClass = melodyNote.slice(0, -1);
      pitchClass = pitchClass.replace("b", "@");

      vtString = pitchClass + "/"+ melodyNote.slice(-1) + " | ";
      vexTabText += vtString;
    });

    vexTabText = vexTabText.slice(0, - 3) + "\n";
    vexTabText += "text :w, ";

    arrChords.forEach(function(chordSymbol) {
      vtString = chordSymbol + ", |, ";
      vexTabText += vtString;
    });

    vexTabText = vexTabText.slice(0, - 5);

    return vexTabText;
  }

  createMelodyRows() {
    var melodyUnitList = this.state.melodyUnitList;
    var melodyRows = [];
    var melodyString, accompanimentString, basslineString, payloadString, arrPayload, midiFilename;

    for(var i = 0; i < melodyUnitList.length; i++) {
      melodyString = melodyUnitList[i].melodyNotes.join(",");
      accompanimentString = AcMelody.getAccompaniment(melodyUnitList[i]).join(",");
      basslineString = AcMelody.getBasicBassLine(melodyUnitList[i]);

      arrPayload = [melodyString, accompanimentString, basslineString];
      payloadString = arrPayload.join(";");
      //midiFilename = melodyUnitList[i].chordProgression.replace(" ", "-") + "-melody" + i;

      melodyRows.push(
        <tr key={"melody" + i} className="ac-melody-row">
          <td>
            <AcButton inputKey="playMelodySolo" inputLabel="Play Melody (Solo)" dataPayload={melodyString} onClick={this.playMelodySolo} />
            <AcButton inputKey="playMelody" inputLabel="Play Melody (Full)" dataPayload={payloadString} onClick={this.playMelody} />
            <AcButton inputKey="stopPlayback" inputLabel="Stop" dataPayload={payloadString} onClick={this.stopPlayback} />
            <AcButton inputKey="downloadMidi" inputLabel="Download MIDI" dataPayload={payloadString} onClick={this.downloadMidi} />
          </td>
          <td>
            <div className="vex-tabdiv">
              {this.createVexTab(melodyUnitList[i].chordProgression, melodyUnitList[i].melodyNotes)}
            </div>
          </td>
          <td>{melodyUnitList[i].smoothness}</td>
          <td>{melodyUnitList[i].range}</td>
        </tr>
      );
    }

    return melodyRows;
  }

  createMelodyTable() {
    console.debug('[OutputPanel.createMelodyTable()] creating table...');

    return(
      <table id="ac-melody-output">
        <thead>
          <tr>
            <th></th>
            <th>Melody</th>
            <th>Smoothness</th>
            <th>Range</th>
          </tr>
        </thead>
        <tbody>
          {this.createMelodyRows()}
        </tbody>
      </table>
    );
  }

  render() {
    if(this.props.isShown) {
      return (
        <div id="output-panel" className="ac-panel output-panel">
          <h2>Melodies!</h2>
          {this.createMelodyTable()}
        </div>
      );
    } else {
      return null;
    }
  }
}



class ControlPanel extends React.Component {
  constructor(props) {
    super(props);
    // Removed state, since this object isn't being used.
  }

  render() {
    // The Control Panel isn't being used atm.
    if(this.props.isShown) {
      return (
        <div id="control-panel" className="ac-panel output-panel" style={styleObj}>
          // Nothing here!
        </div>
      );
    } else {
      return null;
    }
  }
}



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
      chordProgressionPlaceholder: AcLogic.INITIAL_PROGRESSION,

      errorMessage: "",

      // This becomes true whenever we have a chord progression change, and the correct button is clicked.
      // Returns to false after output finishes rendering
      allowMelodyGeneration: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.generateMelodies = this.generateMelodies.bind(this);
    this.outputFinishCallback = this.outputFinishCallback.bind(this);
    this.callbackChangeState = this.callbackChangeState.bind(this);
  }

  /**
  * Changes app state. Meant to be called from child components
  * @param {string} stateKey - App state to change
  * @param {number|string|Object} newState - Assigns this to the state
  */
  callbackChangeState(stateKey, newState) {
    console.debug("app callbackChangeState()");

    var stateObj = function() {
      var returnObj = {};

      returnObj[stateKey] = newState;

      return returnObj;
    }.bind(this)();

    this.setState(stateObj);
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

  outputFinishCallback() {
    // Callback that runs when output panel is finished rendering.
    // Prevents melody generation until the user enters a new progression.
    this.setState({allowMelodyGeneration: false, chordProgressionChanged: false});
  }

  render() {
    var chordProgressionArray = this.state.chordProgressionRaw.split(" ");
    // Assume that we have an empty body tag.
    return (
      <div id="app-container" className="root-panel">
        <div id="main-control-panel" className="ac-panel static-height">
          <h3>AutoComposer</h3>

          <div className="panel-row has-labels">
            <AcTextArea inputKey="chordProgressionRaw" value={this.state.chordProgressionRaw} placeholder={this.state.chordProgressionPlaceholder} onChange={this.handleChange} />
            <AcToggleButton inputKey="showControls" inputLabel="Settings" wrapperAddClass="square" initialState={this.state.showControls} onClickHandler={this.callbackChangeState} disabled={this.state.controlsDisabled} />
          </div>

          <div className="panel-row">
            <AcButton inputKey="generateMelodies" inputLabel="Generate Melodies" onClick={this.generateMelodies} />
            <StatusOutput inputKey="status-output" value="status output..." />
            <AcToggleButton inputKey="showHelp" inputLabel="Help/Info" wrapperAddClass="square" initialState={this.state.showHelp} onClickHandler={this.callbackChangeState} />
          </div>

          <ErrorMessage isShown={this.state.showError} errorMessage={this.state.errorMessage} />

          <DebugPanel isHidden={!this.state.debugMode} debugData={JSON.stringify(this.state, null, 2)}/>
        </div>
        <div id="melody-control-panel" className="ac-panel static-height">
          {/* Melody controls will go here eventually */}
        </div>

        <ControlPanel isShown={this.state.showControls} />

        <HelpPanel isShown={this.state.showHelp} />

        <OutputPanel isShown={this.state.showOutput} chordProgression={chordProgressionArray} allowMelodyGeneration={this.state.allowMelodyGeneration} outputCallback={this.outputFinishCallback}/>

      </div>
    );
  }
}



ReactDOM.render(<AutoComposer />, document.getElementById('react-root'));
