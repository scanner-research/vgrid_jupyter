# vgrid_jupyter: Jupyter integration for VGrid

[![Build Status](https://travis-ci.org/scanner-research/vgrid_jupyter.svg?branch=master)](https://travis-ci.org/scanner-research/vgrid_jupyter)

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
