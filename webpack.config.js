const path = require("path")
const VueLoaderPlugin = require("vue-loader/lib/plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = (env, options) => {
  const dev = options.mode === "development"

  return {
    entry: "./src/main.js",
    output: {
      path: path.resolve(__dirname, "./build"),
      filename: dev ? "bundle.js" : "[name].[contenthash].bundle.js",
      chunkFilename: "[name].[contenthash].chunks.js",
      publicPath: dev ? "/" : ""
    },
    devServer: dev
      ? {
          overlay: true,
          historyApiFallback: true
        }
      : {},
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: "vue-loader"
        },
        {
          test: /\.(m?js)$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/env"],
              plugins: ["babel-plugin-syntax-dynamic-import"]
            }
          }
        },
        {
          test: /\.css$/,
          use: dev
            ? ["vue-style-loader", "css-loader"]
            : [MiniCssExtractPlugin.loader, "css-loader"]
        },
        {
          test: /\.scss$/,
          use: dev
            ? ["vue-style-loader", "css-loader", "sass-loader"]
            : [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
        },
        {
          test: /\.(woff|woff2|eot|ttf)$/,
          loader: "file?name=fonts/[name].[ext]"
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          use: dev
            ? "url-loader"
            : [
                "file-loader?name=./static/media/[name].[hash:8].[ext]",
                {
                  loader: "img-loader",
                  options: {
                    plugins: [
                      require("imagemin-gifsicle")({
                        interlaced: false
                      }),
                      require("imagemin-mozjpeg")({
                        progressive: true,
                        arithmetic: false
                      }),
                      require("imagemin-pngquant")({
                        floyd: 0.5,
                        speed: 2
                      }),
                      require("imagemin-svgo")({
                        plugins: [
                          { removeTitle: true },
                          { convertPathData: false }
                        ]
                      })
                    ]
                  }
                }
              ]
        }
      ]
    },
    optimization: {
      splitChunks: {
        chunks: "all"
      }
    },
    plugins: dev
      ? [
          new HtmlWebpackPlugin({
            template: "./index.html",
            inject: "body"
          }),
          new VueLoaderPlugin()
        ]
      : [
          new CleanWebpackPlugin("build", {}),
          new HtmlWebpackPlugin({
            template: "./index.html",
            inject: "body"
          }),
          new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
          })
        ]
  }
}
