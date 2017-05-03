var React = require('react');
var AcLogic = require('../autocomposer-logic');

/**
* React Component representing the Help/Info Panel
*/
class HelpPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chordArray: AcLogic.getChordDictionary(true)
    }

    this.closePanel = this.closePanel.bind(this);
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

  closePanel(event) {
    this.props.closeFunction("showHelp", false);
  }

  render() {
    var lowestPitch = AcLogic.DEFAULT_LOWER_LIMIT;
    var highestPitch = AcLogic.DEFAULT_UPPER_LIMIT;

    var lowestPitchAccomp = AcLogic.ACCOMPANIMENT_LOWER_LIMIT;
    var highestPitchAccomp = AcLogic.ACCOMPANIMENT_UPPER_LIMIT;

    var lowestPitchBass = AcLogic.BASS_LOWER_LIMIT;
    var highestPitchBass = AcLogic.BASS_UPPER_LIMIT;

    if(this.props.isShown) {
      return (
        <div id="help-panel" className="ac-panel output-panel">
          <div className="panel-spacer">
            <div className="panel-row">
              <h2 className="panel-row-child">Help!</h2>
              <a href="#" className="panel-row-child panel-close-button flex-sm" onClick={this.closePanel}>
                <i className="fa fa-2x fa-close"></i>
              </a>
            </div>
            <h4>How to use this web app:</h4>

            <ol>
              <li>Enter a chord progression in the text box.</li>
              <li>Click the <strong>Generate</strong> button.</li>
              <li>Squeal in delight, as the promised melodies are shown on the screen.</li>
              <li>Click a melody.</li>
              <li>Hit the <i className="fa fa-play"></i> button!</li>
            </ol>

            <h4>Other features:</h4>

            <ul>
              <li>You can download the loaded music by clicking the <i className="fa fa-download"></i> button. The melody will be saved as a MIDI file, containing the generated melody and accompaniment.</li>
              <li>You can also save the score as an image. Just right click it and download!</li>
            </ul>

            <h2>Chord Dictionary</h2>
            <p>These are the chords you can use for this application:</p>
            {this.buildChordDictionary()}

            <h2>Technical Info</h2>
            <ul>
              <li>Smoothness = the distance between notes in the melody (in semitones), all added together</li>
              <li>Range = distance between the lowest note and the highest note (in semitones)</li>
              <li>The MIDI instruments for the voices are:
                <ul>
                  <li>Violin</li>
                  <li>Piano</li>
                  <li>Bass (plucked)</li>
                </ul>
              </li>
              <li>Melody range is {lowestPitch} to {highestPitch}</li>
              <li>Accompaniment range is {lowestPitchAccomp} to {highestPitch}</li>
              <li>Bass range is {lowestPitchBass} to {highestPitchBass}</li>
            </ul>

            <h4>Melodies are filtered/sorted by a few rules:</h4>
            <ul>
              <li>Only the 100 smoothest melodies are shown</li>
              <li>Range must be no greater than one octave</li>
              <li>Only one repetition occurs in the melody</li>
            </ul>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

module.exports = HelpPanel;
