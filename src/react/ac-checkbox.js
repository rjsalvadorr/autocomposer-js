var React = require('react');

/**
* React Component representing a checkbox
*/
class AcCheckbox extends React.Component {
  render() {
    return (
      <div className="ac-control-wrapper">
        <label className="ac-input-label" htmlFor={this.props.inputKey}>{this.props.inputLabel}</label>
        <input id={this.props.inputKey} className="ac-input checkbox" name={this.props.inputKey} data-state-key={this.props.inputKey} type="checkbox" checked={this.props.isChecked} onChange={this.props.onChange}/>
      </div>
    );
  }
}

module.exports = AcCheckbox;
