var React = require('react');

/**
* React Component representing a text input
*/
class AcTextField extends React.Component {
  render() {
    var wrapperClass = "ac-control-wrapper " + this.props.wrapperAddClass;

    return (
      <div className={wrapperClass}>
        <label className="ac-input-label" htmlFor={this.props.inputKey}>{this.props.inputLabel}</label>
        <input id={this.props.inputKey} name={this.props.inputKey} data-state-key={this.props.inputKey} className="ac-input text" type="text" value={this.props.value} onChange={this.props.onChange} />
      </div>
    );
  }
}

module.exports = AcTextField;
