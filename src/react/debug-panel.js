var React = require('react');

/**
* React Component representing a debug panel. Renders text in monospace
*/
class DebugPanel extends React.Component {
  render() {
    if(!this.props.isHidden) {
      return (
        <div id="debug-panel" className="ac-panel">
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

module.exports = DebugPanel;
