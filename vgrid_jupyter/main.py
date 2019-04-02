import ipywidgets as widgets
from traitlets import Unicode, Dict, List

# traitlets: https://ipywidgets.readthedocs.io/en/latest/examples/Widget%20Custom.html#Other-traitlet-types

@widgets.register
class VGridWidget(widgets.DOMWidget):
    _view_name = Unicode('VGridView').tag(sync=True)
    _view_module = Unicode('vgrid_jupyter').tag(sync=True)
    settings = Dict({}).tag(sync=True)
    interval_blocks = List([]).tag(sync=True)
    database = Dict({}).tag(sync=True)
    labels = Dict({}).tag(sync=True)
