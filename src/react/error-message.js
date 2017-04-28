var React = require('react');

/**
* React Component representing an error message
*/
class ErrorMessage extends React.Component {
  render() {
    if(this.props.isShown) {
      return(
        <div id="error-message">
          <p>
            <strong>ERROR!</strong> {this.props.errorMessage}
          </p>
        </div>
      );
    } else {
      return null;
    }
  }
}

module.exports = ErrorMessage;
