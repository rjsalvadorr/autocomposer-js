var React = require('react');
var AutoComposerLogic = require('../autocomposer-logic');
var AcLogic = new AutoComposerLogic.AutoComposerLogic();

/**
* React Component representing the Help/Info Panel
*/
class HelpPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chordArray: AcLogic.getChordDictionary(true)
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
    if(this.props.isShown) {
      return (
        <div id="help-panel" className="ac-panel output-panel">
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

module.exports = HelpPanel;
