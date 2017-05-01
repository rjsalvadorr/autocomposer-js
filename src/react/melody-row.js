var React = require('react');

/**
* React Component for a row in the melody reseults table.
*/
class MelodyRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      /** @type {boolean} isSelected - clicked status. */
      isSelected: false
    };

    /** @type {boolean} isClicked - clicked status. */
    this.isClicked = false;

    this.selectionEventHandler = this.selectionEventHandler.bind(this);

    document.body.addEventListener('newSelection', this.selectionEventHandler);
  }

  /**
  * Sends the melody to the main app. Sets this row's click status.
  */
  clickHandler(event) {
    this.isClicked = true;
    this.props.onClickHandler(event);
  }

  // the "newSelection" event will be triggered on click.
  selectionEventHandler(event) {
    if (this.isClicked) {
      this.setState({isSelected: true});
      this.isClicked = false;
    } else {
      if(this.state.isSelected) {
        this.setState({isSelected: false});
      } else {
        // Not clicked, not selected. Do nothing.
      }
    }
  }

  createVexTab(arrChords, arrMelody) {
    var vtString, pitchClass;
    var vexTabText = "options scale=0.8 space=5 font-size=13 font-face=Times\n";
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

  render() {
    var cName = "ac-melody-row";
    cName += this.state.isSelected ? " selected" : "";

    return (
      <tr className={cName} onClick={(e) => this.clickHandler(e)} data-payload={this.props.dataPayload}>
        <td>
          <div className="vex-tabdiv">
            {this.createVexTab(this.props.chordProgression, this.props.melodyNotes)}
          </div>
        </td>
        <td className="melody-data">{this.props.smoothness}</td>
        <td className="melody-data">{this.props.range}</td>
      </tr>
    );
  }
}

module.exports = MelodyRow;
