const path = require("path");
const webpack = require("webpack");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const viewsPath = path.join(__dirname, "../views");
const sourcePath = path.join(__dirname, "../source");
const destPath = path.join(__dirname, "../extension");
const targetBrowser = process.env.TARGET_BROWSER || "chrome";

module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  webpackFinal: async (config) => {
    config.entry = {
      // background: path.join(sourcePath, "Background", "index.ts"),
      // contentScript: path.join(sourcePath, "ContentScript", "index.ts"),
      // newTab: path.join(sourcePath, "NewTab", "index.tsx"),
      popup: path.join(sourcePath, "Popup", "index.tsx"),
      // options: path.join(sourcePath, "Options", "index.tsx"),
    };

    config.output = {
      path: path.join(destPath, targetBrowser),
      filename: "js/[name].bundle.js",
    };
    config.resolve.extensions.push(".ts", ".tsx");
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__dirname, "../src"),
    ];
    config.module.rules.push({
      test: /\.(js|ts)x?$/,
      loader: "babel-loader",
      exclude: /node_modules/,
    });

    config.module.rules.push({
      test: /\.(sa|sc|c)ss$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader, // It creates a CSS file per JS file which contains CSS
        },
        {
          loader: "css-loader", // Takes the CSS files and returns the CSS with imports and url(...) for Webpack
          options: {
            sourceMap: true,
          },
        },
        {
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              plugins: [
                [
                  "autoprefixer",
                  {
                    // Options
                  },
                ],
              ],
            },
          },
        },
        "resolve-url-loader", // Rewrites relative paths in url() statements
        "sass-loader", // Takes the Sass/SCSS file and compiles to the CSS
      ],
    });

    config.plugins = Array.prototype.concat(config.plugins, [
      new webpack.NormalModuleReplacementPlugin(
        /webextension-polyfill-ts/,
        (resource) => {
          // Gets absolute path to mock `webextension-polyfill-ts` package
          // NOTE: this is required beacuse the `webextension-polyfill-ts`
          // package can't be used outside the environment provided by web extensions
          const absRootMockPath = path.resolve(
            __dirname,
            "../__mocks__/webextension-polyfill-ts.ts"
          );

          // Gets relative path from requesting module to our mocked module
          const relativePath = path.relative(resource.context, absRootMockPath);

          // Updates the `resource.request` to reference our mocked module instead of the real one
          resource.request = relativePath;
        }
      ),
      new HtmlWebpackPlugin({
        template: path.join(viewsPath, "newTab.html"),
        inject: "body",
        chunks: ["newTab"],
        hash: true,
        filename: "newTab.html",
      }),
      new HtmlWebpackPlugin({
        template: path.join(viewsPath, "popup.html"),
        inject: "body",
        chunks: ["popup"],
        hash: true,
        filename: "popup.html",
      }),
      new HtmlWebpackPlugin({
        template: path.join(viewsPath, "options.html"),
        inject: "body",
        chunks: ["options"],
        hash: true,
        filename: "options.html",
      }),
      // write css file(s) to build folder
      new MiniCssExtractPlugin({ filename: "css/[name].css" }),
      // copy static assets
      new CopyWebpackPlugin({
        patterns: [{ from: "source/assets", to: "assets" }],
      }),
    ]);

    // Return the altered config
    return config;
  },
};
