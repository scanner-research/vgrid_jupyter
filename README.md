
# vgrid_jupyter

[![Build Status](https://travis-ci.org/scanner-research/vgrid_jupyter.svg?branch=master)](https://travis-ci.org/scanner-research/vgrid_jupyter)
[![codecov](https://codecov.io/gh/scanner-research/vgrid_jupyter/branch/master/graph/badge.svg)](https://codecov.io/gh/scanner-research/vgrid_jupyter)


Jupyter integration for vgrid

## Installation

You can install using `pip`:

```bash
pip install vgrid_jupyter
```

Or if you use jupyterlab:

```bash
pip install vgrid_jupyter
jupyter labextension install @jupyter-widgets/jupyterlab-manager
```

If you are using Jupyter Notebook 5.2 or earlier, you may also need to enable
the nbextension:
```bash
jupyter nbextension enable --py [--sys-prefix|--user|--system] vgrid_jupyter
```
