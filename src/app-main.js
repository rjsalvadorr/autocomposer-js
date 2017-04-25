const React = require('react');
const ReactDOM = require('react-dom');
const _ = require('underscore');

var AutoComposerData = require('./autocomposer-data');
var AcData = new AutoComposerData.AutoComposerData();

var AutoComposerMelody = require('./autocomposer-melody');
var AcMelody = new AutoComposerMelody.AutoComposerMelody();

var AutoComposerParser = require('./autocomposer-parser');
var AcParser = new AutoComposerParser.AutoComposerParser();

function AcInputException(message) {
   this.message = message;
   this.name = 'AcInputException';
}

class HelpPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chordArray: AcData.getChordDictionary(true)
    }
  }

  buildChordDictionary() {
    var dictionaryItems = [];
    var ctr = 1;

    this.state.chordArray.forEach(function(chordString) {
      dictionaryItems.push(<li key={"chordType" + ctr}>{chordString}</li>);
      ctr++;
    });

    return(
      <ul id="chord-dictionary">
        {dictionaryItems}
      </ul>
    );
  }

  render() {
    if(!this.props.isHidden) {
      return (
        <div id="help-panel" className="autocomposer-panel">
          <h2>Help!</h2>
          <p>How to use this web app:</p>
          <ol>
            <li>Enter a chord progression in the text box.</li>
            <li>Click the "Generate Melodies" button</li>
            <li>Squeal in delight, as the promised melodies are shown on the screen.</li>
          </ol>

          <p>Other pointers:</p>
          <ul>
            <li>You can toggle the Help/Settings panel from the buttons to the right</li>
          </ul>

          <h2>Chord Dictionary</h2>
          <p>These are the chords you can use for this application:</p>
          {this.buildChordDictionary()}

          <h2>Technical Info</h2>
          <ul>
            <li>Default range is Db4 to G#5</li>
            <li>Smoothness = the distance between notes in the melody (in semitones), all added together</li>
            <li>Range = distance between the lowest note and the highest note (in semitones)</li>
          </ul>

          <p>Melodies are filtered/sorted by a few rules:</p>
          <ul>
            <li>Range must be no greater than one octave</li>
            <li>Smoothest melodies are shown first</li>
            <li>Only the 100 smoothest melodies are shown</li>
          </ul>
        </div>
      );
    } else {
      return null;
    }
  }
}



class OutputPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      melodyUnitList: null
    }
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

    for(var i = 0; i < melodyUnitList.length; i++) {
      melodyRows.push(
        <tr key={"melody" + i} className="ac-melody-row">
          <td>
            <div className="vex-tabdiv">
              {this.createVexTab(melodyUnitList[i].chordProgression, melodyUnitList[i].melodyNotes)}
            </div>
          </td>
          <td>{melodyUnitList[i].smoothness}</td>
          <td>{melodyUnitList[i].range}</td>
          <td>{melodyUnitList[i].contour}</td>
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
            <th>Melody</th>
            <th>Smoothness</th>
            <th>Range</th>
            <th>Contour</th>
          </tr>
        </thead>
        <tbody>
          {this.createMelodyRows()}
        </tbody>
      </table>
    );
  }

  render() {
    if(!this.props.isHidden) {
      return (
        <div id="output-panel" className="autocomposer-panel">
          <h2>Melodies!</h2>
          {this.createMelodyTable()}
        </div>
      );
    } else {
      return null;
    }
  }
}



class DebugPanel extends React.Component {
  render() {
    if(!this.props.isHidden) {
      return (
        <div id="r-debug-panel" className="r-component">
          <h3>Debug Info</h3>
          <pre>
            {this.props.debugData}
          </pre>
        </div>
      );
    } else {
      return null;
    }
  }
}



class RjButton extends React.Component {
  render() {
    // This can have a status, passed in from the parent Component
    var buttonClass = this.props.isActive ? "ac-input button active" : "ac-input button";

    return (
      <input type="button" className={buttonClass} id={this.props.inputKey} value={this.props.inputLabel} onClick={this.props.onClick} disabled={this.props.disabled}/>
    );
  }
}



class RjToggleButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: props.initialState === "true"
    };
  }

  handleClick(e) {
    this.setState({isActive: !this.state.isActive});
    this.props.onClickHandler(e);
  }

  render() {
    var buttonClass = this.state.isActive ? "ac-input button active" : "ac-input button";
    return (
      <input type="button" className={buttonClass} id={this.props.inputKey} value={this.props.inputLabel} data-state-key={this.props.inputKey} data-current-state={this.state.isActive} onClick={(e) => this.handleClick(e)} disabled={this.props.disabled}/>
    );
  }
}



class RjTextField extends React.Component {
  render() {
    return (
      <div>
        <label htmlFor={this.props.inputKey}>{this.props.inputLabel}</label>
        <input id={this.props.inputKey} name={this.props.inputKey} data-state-key={this.props.inputKey} className="ac-input textfield" type="text" value={this.props.value} onChange={this.props.onChange} />
      </div>
    );
  }
}



class RjTextArea extends React.Component {
  render() {
    if(this.props.inputLabel) {
      return (
        <div>
          <label htmlFor={this.props.inputKey}>{this.props.inputLabel}</label>
          <textarea id={this.props.inputKey} name={this.props.inputKey} data-state-key={this.props.inputKey} className="ac-input textarea" value={this.props.value} placeholder={this.props.placeholder} onChange={this.props.onChange} />
        </div>
      );
    } else {
      return (
        <textarea id={this.props.inputKey} name={this.props.inputKey} data-state-key={this.props.inputKey} className="ac-input textarea" value={this.props.value} placeholder={this.props.placeholder} onChange={this.props.onChange} />
      );
    }
  }
}



class RjCheckbox extends React.Component {
  render() {
    return (
      <div className="ac-input checkbox">
        <label htmlFor={this.props.inputKey}>{this.props.inputLabel}</label>
        <input id={this.props.inputKey} name={this.props.inputKey} data-state-key={this.props.inputKey} type="checkbox" checked={this.props.isChecked} onChange={this.props.onChange}/>
      </div>
    );
  }
}



class RjRadioSet extends React.Component {
  createRadioItems() {
    let items = [];
    var totalOptions = this.props.options;

    for (var k in totalOptions) {
      if (totalOptions.hasOwnProperty(k)) {
        items.push(<label key={"label-" + k} >{totalOptions[k]} <input key={k} id={this.props.inputKey} name={this.props.inputKey} className="ac-input radio" data-state-key={this.props.inputKey} type="radio" value={k}  onChange={this.props.onChange} /> </label>);
      }
    }

    return items;
  }

  render() {
    return(
      <div className="ac-radioset">
        <fieldset>
          <legend>{this.props.inputLabel}</legend>
          {this.createRadioItems()}
        </fieldset>
      </div>
    );
  }
}



class RjSelect extends React.Component {
  createSelectItems() {
    let items = [];
    var totalOptions = this.props.options;

    for (var k in totalOptions) {
      if (totalOptions.hasOwnProperty(k)) {
        // alert("Key is " + key + ", value is" + totalOptions[key]);
        items.push(<option key={k} value={k}>{totalOptions[k]}</option>);
      }
    }

    return items;
  }

  render() {
    return(
      <div className="ac-input select">
        <label htmlFor={this.props.inputKey}>{this.props.inputLabel}</label>
        <select id={this.props.inputKey} name={this.props.inputKey} data-state-key={this.props.inputKey} onChange={this.props.onChange}>
          {this.createSelectItems()}
        </select>
      </div>
    );
  }
}



class ControlPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text1: 'text one init',
      text2: 'text two init',
      chk1: true,
      chk2: false,
      hideDebug: false,
      btn1: true
    };

    this.handleChange = this.handleChange.bind(this);
  }

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
      }

      console.debug('[handleChange] stateKey=' + stateKey + ', this.target.value=' + this.target.value);

      return returnObj;
    }.bind(event)();

    this.setState(stateObj);
  }

  render() {
    if(!this.props.isHidden) {
      var testSelectOptions = [];
      testSelectOptions['opt1'] = 'Something 1';
      testSelectOptions['opt2'] = 'Something 2';
      testSelectOptions['opt3'] = 'Something 3';
      testSelectOptions['opt4'] = 'Something 4';

      return (

        <div className="r-component">
          <h2>Controls</h2>

          <RjTextField inputKey="text1" inputLabel="For text1" value={this.state.text1} onChange={this.handleChange} />
          <RjTextField inputKey="text2" inputLabel="For text2" value={this.state.text2} onChange={this.handleChange} />

          <RjCheckbox inputKey="hideDebug" inputLabel="Hide Debug Panel?" isChecked={this.state.hideDebug} onChange={this.handleChange} />
          <RjCheckbox inputKey="chk1" inputLabel="Testing chk1" isChecked={this.state.chk1} onChange={this.handleChange} />

          <RjSelect inputKey="select1" inputLabel="For select1" value={this.state.select1} onChange={this.handleChange} options={testSelectOptions} />

          <RjRadioSet inputKey="rad1" inputLabel="For rad1" value={this.state.rad1} onChange={this.handleChange} options={testSelectOptions} />

          <RjToggleButton inputKey="btn1" inputLabel="For btn1" initialState={this.state.btn1} onClickHandler={this.handleChange} />

          <DebugPanel isHidden={this.state.hideDebug} debugData={JSON.stringify(this.state, null, 2)}/>
        </div>
      );
    } else {
      return null;
    }
  }
}



class ErrorMessage extends React.Component {
  render() {
    if(!this.props.isHidden) {
      return(
        <div id="error-message">
          <h2>Error</h2>
          <p>
            {this.props.errorMessage}
          </p>
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
      hideHelp: true,
      hideControls: true,
      hideOutput: true,
      hideError: true,

      debugMode: false,
      controlsDisabled: true, // While this is a mess, no need to show it.

      chordProgressionRaw: "",
      chordProgressionChanged: false,
      chordProgressionPlaceholder: AcData.INITIAL_PROGRESSION,

      errorMessage: "",

      // This becomes true whenever we have a chord progression change, and the correct button is clicked.
      // Returns to false after output finishes rendering
      allowMelodyGeneration: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.generateMelodies = this.generateMelodies.bind(this);
    this.outputFinishCallback = this.outputFinishCallback.bind(this);
  }

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
        if(!AcParser.isValidText(currentChordInput)) {
          throw new AcInputException('Chord input \'' + currentChordInput + '\' is not formatted properly! You should check the chord dictionary in the Help! section.');
        }
      });

      if(chordProgression.length < 2) {
        throw new AcInputException('You need to enter more chords. Two chords in a row is a completely valid input.');
      }

      this.setState({hideError: true, hideOutput: false, allowMelodyGeneration: true});
    } catch(exc) {
      console.warn("[AutoComposer.generateMelodies()] " + exc.message + "\nError Type = " + exc.name);
      this.setState({hideError: false, errorMessage: exc.message});
    }
  }

  outputFinishCallback() {
    // Callback that runs when output panel is finished rendering.
    // Prevents melody generation until the user enters a new progression.
    this.setState({allowMelodyGeneration: false, chordProgressionChanged: false});
  }

  render() {
    var chordProgressionArray = this.state.chordProgressionRaw.split(" ");

    return (
      <div id="r-app-container" className="r-component">

        <div id="wrapper-main-input">
          <div className="wrapper-textarea">
            <RjTextArea inputKey="chordProgressionRaw" value={this.state.chordProgressionRaw} placeholder={this.state.chordProgressionPlaceholder} onChange={this.handleChange} />
            <RjButton inputKey="generateMelodies" inputLabel="Generate Melodies" onClick={this.generateMelodies} />
          </div>

          <div className="wrapper-buttons">
            <RjToggleButton inputKey="hideHelp" inputLabel="Help/Info" initialState={this.state.hideHelp} onClickHandler={this.handleChange} />
            <RjToggleButton inputKey="hideControls" inputLabel="Settings" initialState={this.state.hideControls} onClickHandler={this.handleChange} disabled={this.state.controlsDisabled} />
          </div>
        </div>

        <ErrorMessage isHidden={this.state.hideError} errorMessage={this.state.errorMessage} />

        <ControlPanel isHidden={this.state.hideControls} />
        <HelpPanel isHidden={this.state.hideHelp} />

        <OutputPanel isHidden={this.state.hideOutput} chordProgression={chordProgressionArray} allowMelodyGeneration={this.state.allowMelodyGeneration} outputCallback={this.outputFinishCallback}/>

        <DebugPanel isHidden={!this.state.debugMode} debugData={JSON.stringify(this.state, null, 2)}/>
      </div>
    );
  }
}



ReactDOM.render(<AutoComposer />, document.getElementById('react-root'));
