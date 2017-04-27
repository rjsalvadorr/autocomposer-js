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
    this.setState({isActive: !this.state.isActive});
    this.props.onClickHandler(e);
  }

  render() {
    var buttonClass = this.state.isActive ? "ac-input button active" : "ac-input button";
    return (
      <div className="ac-control-wrapper">
        <input type="button" className={buttonClass} id={this.props.inputKey} value={this.props.inputLabel} data-state-key={this.props.inputKey} data-current-state={this.state.isActive} onClick={(e) => this.handleClick(e)} disabled={this.props.disabled}/>
      </div>
    );
  }
}

module.exports = AcToggleButton;
