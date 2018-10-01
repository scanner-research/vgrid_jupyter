from .main import *

def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'static',
        'dest': 'vgrid_jupyter',
        'require': 'vgrid_jupyter/extension'
    }]
