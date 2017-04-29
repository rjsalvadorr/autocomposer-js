var React = require('react');

/**
* React Component representing the status output
*/
class StatusOutput extends React.Component {
  /**
  * Default constructor
  * @param {Object} props - Properties for this React component
  */
  constructor(props) {
    super(props);

    this.NUM_MESSAGES = 5;
    this.state = {
      statusMessages: []
    }
    this.statusEventHandler = this.statusEventHandler.bind(this);
    document.body.addEventListener('statusUpdate', this.statusEventHandler);
  }

  /**
  * Event handler for status updates.
  * @param {Object} event - Event
  */
  statusEventHandler(event) {
    var message = event.detail;
    var currentMessages = this.state.statusMessages;
    currentMessages.push(message);

    if(currentMessages.length > this.NUM_MESSAGES) {
      currentMessages = currentMessages.slice(-5);
    }

    this.setState({statusMessages: currentMessages});
  }

  buildStatusOutput() {
    var msg, line, lineClass, output = []
    var messages = this.state.statusMessages

    for(var i = messages.length - 1; i >= 0; i--) {
      msg = messages[i];
      lineClass = "line";
      lineClass += msg.search(/error/ig) != -1 ? " hasError" : "";
      if(i == messages.length - 1) {
        lineClass += " first"
      }

      line = <span key={"message-line-" + i} className={lineClass}>{msg}<br/></span>
      output.push(line);
    }
    return output;
  }

  render() {
    return (
      <div className="ac-control-wrapper status-output">
        <p id={this.props.inputKey} name={this.props.inputKey} data-state-key={this.props.inputKey} className="ac-output text">
          {this.buildStatusOutput()}
        </p>
      </div>
    );
  }
}

module.exports = StatusOutput;
