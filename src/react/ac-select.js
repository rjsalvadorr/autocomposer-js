var React = require('react');

/**
* React Component representing a drop-down selec
*/
class AcSelect extends React.Component {
  createSelectItems() {
    let items = [];
    var totalOptions = this.props.options;

    for (var k in totalOptions) {
      if (totalOptions.hasOwnProperty(k)) {
        // alert("Key is " + key + ", value is" + totalOptions[key]);
        items.push(<option key={k} value={k}>{totalOptions[k]}</option>);
      }
    }

    return items;
  }

  render() {
    return(
      <div className="ac-control-wrapper">
        <label htmlFor={this.props.inputKey} className="ac-input-label">{this.props.inputLabel}</label>
        <select id={this.props.inputKey} className="ac-input select" name={this.props.inputKey} data-state-key={this.props.inputKey} onChange={this.props.onChange}>
          {this.createSelectItems()}
        </select>
      </div>
    );
  }
}

module.exports = AcSelect;
