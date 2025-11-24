const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.argv.includes('--mode=production');

module.exports = {
  entry: './src/widget.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'widget-catalog.js',
    library: {
      name: 'WidgetCatalog',
      type: 'umd',
      export: 'default',
    },
    globalObject: 'this',
    clean: false,
		publicPath: isProd 
  ? "/perx-widget-test/" 
  : "/",
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]__[hash:base64:5]',
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              api: 'modern-compiler',
              sassOptions: {
                outputStyle: 'expanded',
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'widget-catalog.css',
    }),
  ],
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  mode: 'production',
};

