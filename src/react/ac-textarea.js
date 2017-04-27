var React = require('react');

/**
* React Component representing a text area
*/
class AcTextArea extends React.Component {
  render() {
    if(this.props.inputLabel) {
      return (
        <div className="ac-control-wrapper">
          <label className="ac-input-label" htmlFor={this.props.inputKey}>{this.props.inputLabel}</label>
          <textarea id={this.props.inputKey} name={this.props.inputKey} data-state-key={this.props.inputKey} className="ac-input textarea" value={this.props.value} placeholder={this.props.placeholder} onChange={this.props.onChange} />
        </div>
      );
    } else {
      return (
        <div className="ac-control-wrapper">
          <textarea id={this.props.inputKey} name={this.props.inputKey} data-state-key={this.props.inputKey} className="ac-input textarea" value={this.props.value} placeholder={this.props.placeholder} onChange={this.props.onChange} />
        </div>
      );
    }
  }
}

module.exports = AcTextArea;
