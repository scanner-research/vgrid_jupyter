# vgrid_jupyter

Jupyter widget for [vgrid](https://github.com/scanner-research/vgrid).

## Install from source

First install [vgrid](https://github.com/scanner-research/vgrid). Then:

```
git clone https://github.com/scanner-research/vgrid_jupyter
cd vgrid_jupyter/js
npm install
npm link vgrid
npm run prepublish
cd ..
pip3 install -e .
jupyter nbextension install vgrid_jupyter --py --symlink --sys-prefix
jupyter nbextension enable vgrid_jupyter --py --sys-prefix
```
