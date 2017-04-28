var React = require('react');

var AutoComposerMelody = require('../autocomposer-melody');
var AcMelody = new AutoComposerMelody.AutoComposerMelody();

var AcButton = require('./ac-button');

class OutputPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      melodyUnitList: null
    }

    this.loadMelody = this.loadMelody.bind(this);
  }

  loadMelody(event) {
    // callback from the main app object
    this.props.loadMelody(event);
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
    var vexTabText = "options scale=0.9 space=5 font-size=13 font-face=Times\n";
    vexTabText += "tabstave\n";
    vexTabText += "notation=true tablature=false\n";
    vexTabText += "notes :w ";

    arrMelody.forEach(function(melodyNote) {
      // Turns a note name like "C#4" into "C#/4 |"
      // Or "Bb4" into "B@/4 |"
      // VexTab notation sure is odd.
      pitchClass = melodyNote.slice(0, -1);
      pitchClass = pitchClass.replace("b", "@");

      vtString = pitchClass + "/"+ melodyNote.slice(-1) + " ";
      vexTabText += vtString;
    });

    vexTabText = vexTabText.slice(0, -1) + "\n";
    vexTabText += "text :w, ";

    arrChords.forEach(function(chordSymbol) {
      vtString = chordSymbol + ", ";
      vexTabText += vtString;
    });

    vexTabText = vexTabText.slice(0, -2);

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

      melodyRows.push(
        <tr key={"melody" + i} className="ac-melody-row">
          <td>
            <AcButton inputKey="loadMelody" inputLabel="Load Melody" dataPayload={payloadString} onClick={this.loadMelody} />
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
          {this.createMelodyTable()}
        </div>
      );
    } else {
      return (
        <div id="output-panel" className="ac-panel output-panel">
        </div>
      );
    }
  }
}

module.exports = OutputPanel;
