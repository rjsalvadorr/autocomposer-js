var React = require('react');

/**
* React Component representing a text area
*/
class AcTextArea extends React.Component {
  render() {
    var wrapperClass = "ac-control-wrapper ";
    wrapperClass += this.props.wrapperAddClass ? this.props.wrapperAddClass : "";

    var inputClass = "ac-input textarea ";
    inputClass += this.props.addClass ? this.props.addClass : "";

    if(this.props.inputLabel) {
      return (
        <div className={wrapperClass}>
          <label className="ac-input-label" htmlFor={this.props.inputKey}>{this.props.inputLabel}</label>
          <textarea id={this.props.inputKey} name={this.props.inputKey} data-state-key={this.props.inputKey} className={inputClass} value={this.props.value} placeholder={this.props.placeholder} onChange={this.props.onChange} />
        </div>
      );
    } else {
      return (
        <div className={wrapperClass}>
          <textarea id={this.props.inputKey} name={this.props.inputKey} data-state-key={this.props.inputKey} className={inputClass} value={this.props.value} placeholder={this.props.placeholder} onChange={this.props.onChange} />
        </div>
      );
    }
  }
}

module.exports = AcTextArea;
