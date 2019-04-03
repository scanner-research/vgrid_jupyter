// Copyright (c) Will Crichton
// Distributed under the terms of the Modified BSD License.

import {
  DOMWidgetModel, DOMWidgetView, ISerializers
} from '@jupyter-widgets/base';

import {
  MODULE_NAME, MODULE_VERSION
} from './version';

import '@wcrichto/vgrid/dist/vgrid.css';

import * as _ from 'lodash';
import {observable, configure} from 'mobx';

// Avoid "multiple mobx instances in application" issue
// https://mobx.js.org/refguide/api.html#-isolateglobalstate-boolean
configure({ isolateGlobalState: true });

import React from 'react';
import ReactDOM from 'react-dom';
import {VGridProps, IntervalSet, Database, VGrid, LabelState, vdata_from_json} from '@wcrichto/vgrid';

// Use window.require so webpack doesn't try to import ahead of time
let Jupyter = (window as any).require('base/js/namespace');

export
class VGridModel extends DOMWidgetModel {
  defaults() {
    return {...super.defaults(),
      _model_name: VGridModel.model_name,
      _model_module: VGridModel.model_module,
      _model_module_version: VGridModel.model_module_version,
      _view_name: VGridModel.view_name,
      _view_module: VGridModel.view_module,
      _view_module_version: VGridModel.view_module_version,
      value : 'Hello World'
    };
  }

  static serializers: ISerializers = {
      ...DOMWidgetModel.serializers,
      // Add any extra serializers here
    }

  static model_name = 'VGridModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'VGridView';   // Set to null if no view
  static view_module = MODULE_NAME;   // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

class VGridContainer extends React.Component<VGridProps, {keyboardDisabled: boolean}> {
  state = {
    keyboardDisabled: false
  }

  _timer: any = null

  _onClick = () => {
    let disabled = !this.state.keyboardDisabled;

    // wcrichto 5-25-18: in order to disable the Jupyter keyboard manager, we have to call disable
    // in an infinite loop. This is because the ipywidgets framework uses
    // KeyboardManager.register_events on the widget container which can cause unpredictable behavior
    // in unexpectedly reactivating the keyboard manager (hard to consistently maintain focus on the
    // widget area), so the simplest hacky solution is just to forcibly disable the manager by
    // overriding all other changes to its settings.
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
    let JupyterButton = <button onClick={this._onClick}>{
        this.state.keyboardDisabled ? 'Enable Jupyter keyboard' : 'Disable Jupyter keyboard'
      }</button>;
    return (
      <div className='vgrid-container' onClick={(e) => { e.stopPropagation(); }}>
        {JupyterButton}
        <VGrid {...this.props} />
        {JupyterButton}
      </div>
    )
  }
}

export
class VGridView extends DOMWidgetView {
  database: Database
  interval_blocks: {interval_sets: {[key: string]: IntervalSet}, video_id: number}[]

  constructor(params: any) {
    super(params);

    let interval_blocks = this.model.get('interval_blocks');
    let database = this.model.get('database');

    this.database = Database.from_json(database);
    this.interval_blocks = interval_blocks.map((intervals: any) => {
      let {video_id, interval_dict} = intervals;
      return {
        video_id: video_id,
        interval_sets: _.mapValues(interval_dict, (intervals, name) =>
          (IntervalSet as any).from_json(intervals, vdata_from_json))
      };
    });
  }

  label_callback(labels: LabelState) {
    this.model.set('labels', labels.to_json());
    this.model.save_changes();
  }

  render() {
    ReactDOM.render(
      <VGridContainer interval_blocks={this.interval_blocks!} database={this.database!}
                      settings={this.model.get('settings')}
                      label_callback={this.label_callback.bind(this)} />,
      this.el);
  }

  remove() {
    if (!ReactDOM.unmountComponentAtNode(this.el)) {
      console.error('Failed to unmount VGrid');
    }
  }
}
