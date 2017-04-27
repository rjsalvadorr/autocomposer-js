var React = require('react');

/**
* React Component representing a set of radio buttons
*/
class AcRadioSet extends React.Component {
  createRadioItems() {
    let items = [];
    var totalOptions = this.props.options;

    for (var k in totalOptions) {
      if (totalOptions.hasOwnProperty(k)) {
        items.push(
          <label key={"label-" + k} >{totalOptions[k]}
            <input key={k} id={this.props.inputKey} name={this.props.inputKey} className="ac-input radio" data-state-key={this.props.inputKey} type="radio" value={k}  onChange={this.props.onChange} />
          </label>
        );
      }
    }

    return items;
  }

  render() {
    return(
      <div className="ac-control-wrapper">
        <fieldset>
          <legend>{this.props.inputLabel}</legend>
          {this.createRadioItems()}
        </fieldset>
      </div>
    );
  }
}

module.exports = AcRadioSet;
