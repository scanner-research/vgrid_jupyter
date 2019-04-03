const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');
const version = require('./package.json').version;

// Custom webpack rules
const rules = [
  { test: /\.*css$/,
    use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader']
  },
  { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
  { test: /\.js$/, loader: 'source-map-loader' },
];

// Packages that shouldn't be bundled but loaded at runtime
const externals = ['@jupyter-widgets/base'];

const resolve = {
  // Add '.ts' and '.tsx' as resolvable extensions.
  extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
};

const plugins = [new MiniCssExtractPlugin({filename: 'index.css'})];

module.exports = [
  /**
   * Notebook extension
   *
   * This bundle only contains the part of the JavaScript that is run on load of
   * the notebook.
   */
  {
    entry: './src/extension.ts',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'vgrid_jupyter', 'nbextension', 'static'),
      libraryTarget: 'amd'
    },
    module: {
      rules: rules
    },
    devtool: 'source-map',
    externals,
    resolve,
    plugins,
  },

  /**
   * Embeddable vgrid_jupyter bundle
   *
   * This bundle is almost identical to the notebook extension bundle. The only
   * difference is in the configuration of the webpack public path for the
   * static assets.
   *
   * The target bundle is always `distjs/index.js`, which is the path required by
   * the custom widget embedder.
   */
  {
    entry: './src/index.ts',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'distjs'),
        libraryTarget: 'amd',
        library: "vgrid_jupyter",
        publicPath: 'https://unpkg.com/vgrid_jupyter@' + version + '/distjs/'
    },
    devtool: 'source-map',
    module: {
        rules: rules
    },
    externals,
    resolve,
    plugins,
  },


  /**
   * Documentation widget bundle
   *
   * This bundle is used to embed widgets in the package documentation.
   */
  {
    entry: './src/index.ts',
    output: {
      filename: 'embed-bundle.js',
      path: path.resolve(__dirname, 'docs', 'source', '_static'),
      library: "vgrid_jupyter",
      libraryTarget: 'amd'
    },
    module: {
      rules: rules
    },
    devtool: 'source-map',
    externals,
    resolve,
    plugins,
  }

];
