var React = require('react');

/**
* React Component representing a toggle button
*/
class AcToggleButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isActive: props.initialState === "true"
    };
  }

  handleClick(e) {
    var activeState = this.state.isActive;
    if(typeof this.props.isActive !== "undefined" && this.props.isActive !== null) {
      // isActive property overrides actual button state.
      activeState = this.props.isActive;
    }

    var newActive = !activeState;

    this.setState({isActive: newActive});

    this.props.onClickHandler(this.props.inputKey, newActive);
  }

  getIconElement() {
    if(this.props.icon) {
      var iconClass = "fa fa-2x fa-" + this.props.icon;
      return <i className={iconClass}></i>
    } else {
      return "";
    }
  }

  render() {
    var activeState = this.state.isActive;
    if(typeof this.props.isActive !== "undefined" && this.props.isActive !== null) {
      // isActive property overrides actual button state.
      activeState = this.props.isActive;
    }

    var buttonClass = activeState ? "ac-input button active " : "ac-input button";
    buttonClass += this.props.addClass ? " " + this.props.addClass: "";
    buttonClass += this.props.disabled ? " disabled" : "";

    var wrapperClass = "ac-control-wrapper";
    wrapperClass += this.props.wrapperAddClass ? " " + this.props.wrapperAddClass: "";

    return (
      <div className={wrapperClass}>
        <button className={buttonClass} id={this.props.inputKey} data-state-key={this.props.inputKey} data-current-state={this.state.isActive} onClick={(e) => this.handleClick(e)} disabled={this.props.disabled}>
          {this.getIconElement()} {this.props.inputLabel}
        </button>
      </div>
    );
  }
}

module.exports = AcToggleButton;
