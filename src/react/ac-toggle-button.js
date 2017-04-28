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

    console.debug("toggle constructor()");
  }

  handleClick(e) {
    console.debug("toggle handleClick()");
    var newActive = !this.state.isActive;
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
    console.debug("toggle render()");
    var buttonClass = this.state.isActive ? "ac-input button active " : "ac-input button";
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
