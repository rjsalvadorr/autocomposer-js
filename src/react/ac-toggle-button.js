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

  render() {
    console.debug("toggle render()");
    var buttonClass = this.state.isActive ? "ac-input button active " : "ac-input button ";
    buttonClass += this.props.addClass ? this.props.addClass: "";

    var wrapperClass = "ac-control-wrapper ";
    wrapperClass += this.props.wrapperAddClass ? this.props.wrapperAddClass: "";

    return (
      <div className={wrapperClass}>
        <input type="button" className={buttonClass} id={this.props.inputKey} value={this.props.inputLabel} data-state-key={this.props.inputKey} data-current-state={this.state.isActive} onClick={(e) => this.handleClick(e)} disabled={this.props.disabled}/>
      </div>
    );
  }
}

module.exports = AcToggleButton;
