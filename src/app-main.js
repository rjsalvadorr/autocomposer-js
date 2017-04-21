window.$ = window.jQuery = require('jquery/dist/jquery.min');
var React = require('react');
var ReactDOM = require('react-dom');

var AutoComposerData = require('./autocomposer-data');
var AutoComposerMelody = require('./autocomposer-melody');
var AutoComposerParser = require('./autocomposer-parser');



class HelpPanel extends React.Component {
  render() {
    if(!this.props.isHidden) {
      return (
        <div id="help-panel" className="autocomposer-panel">
          <h2>Help!</h2>
          <p>Help text will go here eventually...</p>
        </div>
      );
    } else {
      return null;
    }
  }
}



class OutputPanel extends React.Component {
  render() {
    if(!this.props.isHidden) {
      return (
        <div id="output-panel" className="autocomposer-panel">
          <h2>Melodies!</h2>
          <p>Melodies will go here eventually...</p>
        </div>
      );
    } else {
      return null;
    }
  }
}



class DebugPanel extends React.Component {
  render() {
    if(!this.props.isHidden) {
      return (
        <div id="r-debug-panel" className="r-component">
          <h3>Debug Info</h3>
          <pre>
            {this.props.debugData}
          </pre>
        </div>
      );
    } else {
      return null;
    }
  }
}



class RjToggleButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentState: props.initialState
    };
  }

  handleClick(e) {
    this.setState({currentState: !this.state.currentState});
    this.props.onClickHandler(e);
  }

  render() {
    return (
      <input type="button" className="r-component-input" id={this.props.inputKey} value={this.props.inputLabel} data-state-key={this.props.inputKey} data-current-state={this.state.currentState} onClick={(e) => this.handleClick(e)} />
    );
  }
}



class RjTextField extends React.Component {
  render() {
    return (
      <div className="r-component-input">
        <label htmlFor={this.props.inputKey}>{this.props.inputLabel}</label>
        <input id={this.props.inputKey} name={this.props.inputKey} data-state-key={this.props.inputKey} type="text" value={this.props.value} onChange={this.props.onChange} />
      </div>
    );
  }
}



class RjCheckbox extends React.Component {
  render() {
    return (
      <div className="r-component-input">
        <label htmlFor={this.props.inputKey}>{this.props.inputLabel}</label>
        <input id={this.props.inputKey} name={this.props.inputKey} data-state-key={this.props.inputKey} type="checkbox" checked={this.props.isChecked} onChange={this.props.onChange}/>
      </div>
    );
  }
}



class RjRadioSet extends React.Component {
  createRadioItems() {
    let items = [];
    var totalOptions = this.props.options;

    for (var k in totalOptions) {
      if (totalOptions.hasOwnProperty(k)) {
        items.push(<label key={"label-" + k} >{totalOptions[k]} <input key={k} id={this.props.inputKey} name={this.props.inputKey}  data-state-key={this.props.inputKey} type="radio" value={k}  onChange={this.props.onChange} /> </label>);
      }
    }

    return items;
  }

  render() {
    return(
      <div className="r-component-input">
        <fieldset>
          <legend>{this.props.inputLabel}</legend>
          {this.createRadioItems()}
        </fieldset>
      </div>
    );
  }
}



class RjSelect extends React.Component {
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
      <div className="r-component-input">
        <label htmlFor={this.props.inputKey}>{this.props.inputLabel}</label>
        <select id={this.props.inputKey} name={this.props.inputKey} data-state-key={this.props.inputKey} onChange={this.props.onChange}>
          {this.createSelectItems()}
        </select>
      </div>
    );
  }
}



class ControlPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text1: 'text one init',
      text2: 'text two init',
      chk1: true,
      chk2: false,
      hideDebug: false,
      btn1: true
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {

    var stateObj = function() {
      var stateKey = this.target.dataset["stateKey"];
      var returnObj = {};

      if(this.target.type === "checkbox") {
        returnObj[stateKey] = this.target.checked;
      } else if(this.target.type === "button") {
        returnObj[stateKey] = this.target.dataset["currentState"] === "true";
      } else {
        returnObj[stateKey] = this.target.value;
      }

      console.debug('[handleChange] stateKey=' + stateKey + ', this.target.value=' + this.target.value);

      return returnObj;
    }.bind(event)();

    this.setState(stateObj);
  }

  render() {
    var testSelectOptions = [];
    testSelectOptions['opt1'] = 'Something 1';
    testSelectOptions['opt2'] = 'Something 2';
    testSelectOptions['opt3'] = 'Something 3';
    testSelectOptions['opt4'] = 'Something 4';

    return (
      <div className="r-component">
        <h2>Controls</h2>

        <RjTextField inputKey="text1" inputLabel="For text1" value={this.state.text1} onChange={this.handleChange} />
        <RjTextField inputKey="text2" inputLabel="For text2" value={this.state.text2} onChange={this.handleChange} />

        <RjCheckbox inputKey="hideDebug" inputLabel="Hide Debug Panel?" isChecked={this.state.hideDebug} onChange={this.handleChange} />
        <RjCheckbox inputKey="chk1" inputLabel="Testing chk1" isChecked={this.state.chk1} onChange={this.handleChange} />

        <RjSelect inputKey="select1" inputLabel="For select1" value={this.state.select1} onChange={this.handleChange} options={testSelectOptions} />

        <RjRadioSet inputKey="rad1" inputLabel="For rad1" value={this.state.rad1} onChange={this.handleChange} options={testSelectOptions} />

        <RjToggleButton inputKey="btn1" inputLabel="For btn1" initialState={this.state.btn1} onClickHandler={this.handleChange} />

        <DebugPanel isHidden={this.state.hideDebug} debugData={JSON.stringify(this.state, null, 2)}/>
      </div>
    );
  }
}



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hideHelp: true,
      hideControls: true,
      hideOutput: true
    };
  }

  render() {
    return (
      <div id="r-app-container" className="r-component">
        <ControlPanel />
        <HelpPanel />
        <OutputPanel />
      </div>
    );
  }
}



$(document).ready(function() {
  ReactDOM.render(
    <App />,
    document.getElementById('react-root')
  );
});
