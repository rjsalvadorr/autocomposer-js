var React = require('react');

/**
* React Component representing an error message
*/
class ErrorMessage extends React.Component {
  render() {
    if(!this.props.isHidden) {
      return(
        <div id="error-message">
          <h2>Error</h2>
          <p>
            {this.props.errorMessage}
          </p>
        </div>
      );
    } else {
      return null;
    }
  }
}

module.exports = ErrorMessage;
