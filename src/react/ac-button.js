var React = require('react');

/**
* React Component representing a simple button
*/
class AcButton extends React.Component {
  getIconElement() {
    if(this.props.icon) {
      var iconClass = "fa fa-2x fa-" + this.props.icon;
      return <i className={iconClass}></i>
    } else {
      return "";
    }
  }

  render() {
    // This can have a status, passed in from the parent Component
    var buttonClass = this.props.isActive ? "ac-input button active " : "ac-input button";
    buttonClass += this.props.addClass ? " " + this.props.addClass: "";
    buttonClass += this.props.disabled ? " disabled" : "";

    var wrapperClass = "ac-control-wrapper";
    wrapperClass += this.props.wrapperAddClass ? " " + this.props.wrapperAddClass: "";

    return (
      <div className={wrapperClass}>
        <button className={buttonClass} id={this.props.inputKey} onClick={this.props.onClick} disabled={this.props.disabled} data-payload={this.props.dataPayload}>
          {this.getIconElement()} {this.props.inputLabel}
        </button>
      </div>
    );
  }
}

module.exports = AcButton;
