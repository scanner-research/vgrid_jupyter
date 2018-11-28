import 'vgrid/dist/vgrid.css';

import {observable, configure} from 'mobx';

// Avoid "multiple mobx instances in application" issue
// https://mobx.js.org/refguide/api.html#-isolateglobalstate-boolean
configure({ isolateGlobalState: true });

import React from 'react';
import ReactDOM from 'react-dom';
import VGrid from 'vgrid';

// For some reason, `import` syntax doesn't work here? AMD issues?
let widgets = require('@jupyter-widgets/base');

// Use window.require so webpack doesn't try to import ahead of time
let Jupyter = window.require('base/js/namespace');

export class VGridContainer extends React.Component {
  state = {
    keyboardDisabled: false
  }

  _timer = null

  _onClick = () => {
    let disabled = !this.state.keyboardDisabled;

    // wcrichto 5-25-18: in order to disable the Jupyter keyboard manager, we have to call disable in an infinite
    // loop. This is because the ipywidgets framework uses KeyboardManager.register_events on the widget container
    // which can cause unpredictable behavior in unexpectedly reactivating the keyboard manager (hard to consistently
    // maintain focus on the widget area), so the simplest hacky solution is just to forcibly disable the manager
    // by overriding all other changes to its settings.
    if (disabled) {
      this._timer = setInterval(() => {Jupyter.keyboard_manager.disable();}, 100);
    } else {
      clearInterval(this._timer);
      Jupyter.keyboard_manager.enable();
    }
    this.setState({keyboardDisabled: disabled});
  }

  componentWillUnmount() {
    if (this._timer != null) {
      clearInterval(this._timer);
    }

    Jupyter.keyboard_manager.enable();
  }

  render() {
    let JupyterButton = () => <button onClick={this._onClick}>{
        this.state.keyboardDisabled ? 'Enable Jupyter keyboard' : 'Disable Jupyter keyboard'
    }</button>;
    return (
      <div className='vgrid-container' onClick={(e) => { e.stopPropagation(); }}>
        <JupyterButton />
        {this.props.data !== null ? <VGrid {...this.props} /> : <span>No results.</span>}
        <JupyterButton />
      </div>
    )
  }
}

export let VGridView = widgets.DOMWidgetView.extend({
  render: function() {
    let data = this.model.get('result');
    let settings = observable.map(this.model.get('settings'));

    let fields = {
      selected: [],
      ignored: []
    };

    let updateFields = (updates) => {
      Object.assign(fields, updates);
      for (let [k, v] of Object.entries(fields)) {
        this.model.set(k, v);
      }
      console.log(this.model, fields);
      this.model.save_changes();
    };

    let onSelect = (selected) => {
      updateFields({selected: selected});
    };
 
    let onIgnore = (ignored) => {
      updateFields({ignored: ignored});
    };

    ReactDOM.render(
      <VGridContainer data={data} settings={settings} onSelect={onSelect} onIgnore={onIgnore} />,
      this.el);
  }
});

export let version = require('../package.json').version;
