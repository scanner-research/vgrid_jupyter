from setuptools import setup, find_packages

static_files = ['extension', 'jupyter', 'common']

setup(
    name='vgrid_jupyter',
    version='0.1.0',
    data_files=[
        ('share/jupyter/nbextension/vgrid_jupyter', sum([
            ['vgrid_jupyter/static/{}.js'.format(f),
             'vgrid_jupyter/static/{}.js.map'.format(f)]
            for f in static_files
        ], []),),
        ('etc/jupyter/nbconfig/notebook.d/' ,['vgrid_jupyter.json'])
    ],
    install_requires=[
        'ipywidgets >= 7.0.0'
    ],
    zip_safe=False,
    packages=find_packages()
)
