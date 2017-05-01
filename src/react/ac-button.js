var React = require('react');

/**
* React Component representing a simple button
*/
class AcButton extends React.Component {
  getIconElement() {
    if(this.props.icon) {
      var iconClass;

      if(this.props.inputLabel) {
        iconClass = "fa fa-lg fa-" + this.props.icon;
      } else {
        iconClass = "fa fa-2x fa-" + this.props.icon;
      }
      return <i className={iconClass}></i>
    } else {
      return "";
    }
  }

  getLabelElement() {
    if(this.props.inputLabel) {
      var labelElem;

      if(this.props.icon) {
        labelElem = <span className="button-text-icon">{this.props.inputLabel}</span>
      } else {
        labelElem = this.props.inputLabel;
      }

      return labelElem
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

    var lineBreak = this.props.inputLabel && this.props.icon ? <br/> : "";

    if(this.props.noWrapper) {
      return (
        <button className={buttonClass} id={this.props.inputKey} onClick={this.props.onClick} disabled={this.props.disabled} data-payload={this.props.dataPayload}>
          {this.getIconElement()} {lineBreak} {this.getLabelElement()}
        </button>
      );
    } else {
      return (
        <div className={wrapperClass}>
          <button className={buttonClass} id={this.props.inputKey} onClick={this.props.onClick} disabled={this.props.disabled} data-payload={this.props.dataPayload}>
            {this.getIconElement()} {lineBreak} {this.getLabelElement()}
          </button>
        </div>
      );
    }
  }
}

module.exports = AcButton;
