# vgrid_jupyter: Jupyter integration for VGrid

[![Build Status](https://travis-ci.com/scanner-research/vgrid_jupyter.svg?branch=master)](https://travis-ci.com/scanner-research/vgrid_jupyter)

This repository provides a plugin for using the [VGrid](https://github.com/scanner-research/vgrid) javascript library in a Jupyter notebook.

## Installation

You must have Python 3 and [npm](https://www.npmjs.com/get-npm) already installed.

### From pip

```
pip3 install vgrid_jupyter
jupyter nbextension enable --py --sys-prefix vgrid_jupyter
```

### From source

```
git clone https://github.com/scanner-research/vgrid_jupyter
cd vgrid_jupyter
npm install
npm run build
npm link @wcrichto/vgrid # run this if you also installed vgrid from source
pip3 install -e .
jupyter nbextension install --py --sys-prefix --symlink vgrid_jupyter
jupyter nbextension enable --py --sys-prefix vgrid_jupyter
```

## Usage

This module exports one class `VGridWidget` that embeds VGrid in a Jupyter cell. See the [VGrid documentation](https://github.com/scanner-research/vgrid#example-usage) for explanation of the VGrid Python API.

```python
from rekall import Interval, IntervalSet, Bounds3D, IntervalSetMapping
from vgrid import VGridSpec, VideoMetadata, VideoBlockFormat, LabelState
from vgrid_jupyter import VGridWidget

video_id = 1
video = VideoMetadata(path='test.mp4', id=video_id)
intervals = IntervalSet([Interval(Bounds3D(0, 10))])
interval_map = IntervalSetMapping({video_id: intervals})

vgrid_spec = VGridSpec(
  video_meta=[video],
  vis_format=VideoBlockFormat([('test', interval_map)]))

vgrid_widget = VGridWidget(vgrid_spec=vgrid_spec.to_json())
vgrid_widget
```

Putting this sample into a code cell will make VGrid render beneath it. In a different code cell, you can access any created labels through:

```python
label_state = LabelState(lambda: vgrid_widget.label_state)
print(label_state.block_labels(), label_state.blocks_selected())
```
