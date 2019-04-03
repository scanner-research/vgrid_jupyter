const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const version = require('./package.json').version;

// Custom webpack rules are generally the same for all webpack bundles, hence
// stored in a separate local variable.
const rules = [
  {
    // Save imported CSS to separate file
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        'css-loader',
        'sass-loader'
      ]
    })
  },
  {
    // Compile JSX files to JS
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: [{
      loader: 'babel-loader',
      options: {
        plugins: ['transform-decorators-legacy'],
        presets: ['env', 'stage-0', 'react']
      }
    }]
  },
  {
    // Include source maps from dependencies
    test: /\.js$/,
    use: ["source-map-loader"],
    enforce: "pre"
  }
]

const plugins = [new ExtractTextPlugin(`index.css`)]

const resolve = {
  extensions: ['.js', '.jsx', '.css'],
  symlinks: false // https://github.com/webpack/webpack/issues/1643#issuecomment-317436595
}

module.exports = [
  {// Notebook extension
    //
    // This bundle only contains the part of the JavaScript that is run on
    // load of the notebook. This section generally only performs
    // some configuration for requirejs, and provides the legacy
    // "load_ipython_extension" function which is required for any notebook
    // extension.
    //
    entry: './lib/extension.js',
   output: {
     filename: 'extension.js',
     path: path.resolve(__dirname, '..', 'vgrid_jupyter', 'static'),
     libraryTarget: 'amd'
   },
   devtool: 'source-map',
   module: { rules: rules }
  },

  {// Bundle for the notebook containing the custom widget views and models
    //
    // This bundle contains the implementation for the custom widget views and
    // custom widget.
    // It must be an amd module
    //
    entry: './lib/index.js',
   plugins: plugins,
   output: {
     filename: 'index.js',
     path: path.resolve(__dirname, '..', 'vgrid_jupyter', 'static'),
     libraryTarget: 'amd'
   },
   devtool: 'source-map',
   module: {
     rules: rules
   },
   externals: ['@jupyter-widgets/base'],
   resolve: resolve
  },

  {// Embeddable vgrid_jupyter bundle
    //
    // This bundle is generally almost identical to the notebook bundle
    // containing the custom widget views and models.
    //
    // The only difference is in the configuration of the webpack public path
    // for the static assets.
    //
    // It will be automatically distributed by unpkg to work with the static
    // widget embedder.
    //
    // The target bundle is always `dist/index.js`, which is the path required
    // by the custom widget embedder.
    //
    entry: './lib/embed.js',
   plugins: plugins,
   output: {
     filename: 'index.js',
     path: path.resolve(__dirname, 'dist'),
     libraryTarget: 'amd',
     publicPath: 'https://unpkg.co/vgrid_jupyter@' + version + '/dist/'
   },
   devtool: 'source-map',
   module: {
     rules: rules
   },
   externals: ['@jupyter-widgets/base'],
   resolve: resolve
  }
];
