import Path from "path";

import type Webpack from "webpack";
import HtmlBundler from "html-webpack-plugin";
import CssExtractor from "mini-css-extract-plugin";
import TsPathParser from "tsconfig-paths-webpack-plugin";
import tsPaths2Alias from "./tsPaths2Alias";


const env = process.env.NODE_ENV ?? "production";
if (env !== "development" && env !== "production") {
  throw new TypeError("NODE_ENV must be either development or production.");
}

const context = Path.resolve(__dirname, "src");
const resourcePath = "/";
const outputPath = Path.resolve(__dirname, `build${resourcePath}`);

const config: Webpack.Configuration = {
  mode: env,
  context,
  entry: "./index.ts",
  output: {
    filename: "index.js",
    path: outputPath,
    publicPath: resourcePath,
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    // doesn't work on linux
    plugins: [
      new TsPathParser(),
    ],
    // work on both linux and windows
    // alias: tsPaths2Alias(),
    // work on both linux and windows
    // alias: {
    //   css: Path.resolve(__dirname, "src/styles/css"),
    //   "/images/pages/search": Path.resolve(__dirname, "src/styles/images"),
    // },
  },
  plugins: [
    new HtmlBundler({
      template: "./index.html",
      hash: true,
    }),
    new CssExtractor({
      filename: "index.css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          "ts-loader",
        ]
      },
      {
        test: /\.(sc|sa|c)ss?$/,
        exclude: /node_modules/,
        use: [
          CssExtractor.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              url: (url: string) => !url.match(/openimage|xmlns/),
            }
          },
          "resolve-url-loader",
          {
            loader: "sass-loader",
            options: {
              /**
               * for resolve-url-loader to be able to parse relative url
               */
              sourceMap: true,
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        type: "asset/resource",
      }
    ]
  },
  stats: {
    builtAt: true,
    timings: true,
    modules: false,
  },
};

export default config;
