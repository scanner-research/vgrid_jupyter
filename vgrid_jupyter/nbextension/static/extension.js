// Entry point for the notebook bundle containing custom model definitions.
//
define(function() {
  "use strict";

  window['requirejs'].config({
    map: {
      '*': {
        'vgrid_jupyter': 'nbextensions/vgrid_jupyter/index',
      },
    }
  });

  window.__webpack_public_path__ = document.querySelector('body').getAttribute('data-base-url') + 'nbextensions/vgrid_jupyter';

  // Export the required load_ipython_extension function
  return {
    load_ipython_extension : function() {
      let link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.type ='text/css';
      link.href = `${__webpack_public_path__}/index.css`;
      document.head.appendChild(link);
    }
  };
});
