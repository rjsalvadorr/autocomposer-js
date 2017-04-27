var React = require('react');


/**
* React Component representing a simple button
*/
class AcButton extends React.Component {
  render() {
    // This can have a status, passed in from the parent Component
    var buttonClass = this.props.isActive ? "ac-input button active" : "ac-input button";

    return (
      <div className="ac-control-wrapper">
        <input type="button" className={buttonClass} id={this.props.inputKey} value={this.props.inputLabel} onClick={this.props.onClick} disabled={this.props.disabled} data-payload={this.props.dataPayload}/>
      </div>
    );
  }
}

module.exports = AcButton;
