var React = require('react');

/**
* React Component representing a text input
*/
class StatusOutput extends React.Component {
  render() {

    return (
      <div className="ac-control-wrapper status-output">
        <input id={this.props.inputKey} name={this.props.inputKey} data-state-key={this.props.inputKey} className="ac-output text" type="text" value={this.props.value} readOnly="true"/>
      </div>
    );
  }
}

module.exports = StatusOutput;
