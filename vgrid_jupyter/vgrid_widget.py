#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Will Crichton.
# Distributed under the terms of the Modified BSD License.

"""
TODO: Add module docstring
"""

from ipywidgets import DOMWidget
from traitlets import Unicode, Dict, List
from ._frontend import module_name, module_version


class VGridWidget(DOMWidget):
    """TODO: Add docstring here
    """
    _model_name = Unicode('VGridModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode('VGridView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)

    settings = Dict({}).tag(sync=True)
    interval_blocks = List([]).tag(sync=True)
    database = Dict({}).tag(sync=True)
    labels = Dict({}).tag(sync=True)
