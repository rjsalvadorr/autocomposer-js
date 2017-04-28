var React = require('react');

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

module.exports = ControlPanel;
