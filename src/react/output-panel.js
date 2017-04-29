var React = require('react');

var AutoComposerMelody = require('../autocomposer-melody');
var AcMelody = new AutoComposerMelody.AutoComposerMelody();

var MelodyRow = require('./melody-row');
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

  createMelodyRows() {
    var melodyUnitList = this.state.melodyUnitList;
    var melodyRows = [];
    var melodyString, accompanimentString, basslineString, payloadString, arrPayload, rawProgression, rawNotes;

    for(var i = 0; i < melodyUnitList.length; i++) {
      melodyString = melodyUnitList[i].melodyNotes.join(",");
      accompanimentString = AcMelody.getAccompaniment(melodyUnitList[i]).join(",");
      basslineString = AcMelody.getBasicBassLine(melodyUnitList[i]);

      arrPayload = [melodyString, accompanimentString, basslineString];
      payloadString = arrPayload.join(";");

      rawProgression = melodyUnitList[i].chordProgression;
      rawNotes = melodyUnitList[i].melodyNotes;

      melodyRows.push(
        <MelodyRow key={"m-row-" + i} onClickHandler={this.props.loadMelody} dataPayload={payloadString} chordProgression={rawProgression}  melodyNotes={rawNotes} smoothness={melodyUnitList[i].smoothness} range={melodyUnitList[i].range}/>
      );
    }

    return melodyRows;
  }

  render() {
    if(this.props.isShown) {
      console.debug('[OutputPanel.render()] creating table...');

      return (
        <div id="output-panel" className="ac-panel output-panel">
          <table id="ac-melody-output">
            <thead>
              <tr>
                <th>Melody</th>
                <th>Smoothness</th>
                <th>Range</th>
              </tr>
            </thead>
            <tbody>
              {this.createMelodyRows()}
            </tbody>
          </table>
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
