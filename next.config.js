const _ = require("lodash");

const BABEL_LOADER_STRING = "babel/loader";
const makeLinariaLoaderConfig = babelOptions => ({
  loader: require.resolve("@linaria/webpack-loader"),
  options: {
    sourceMap: true,
    extension: ".linaria.module.css",
    babelOptions: _.omit(
      babelOptions,
      "isServer",
      "distDir",
      "pagesDir",
      "development",
      "hasReactRefresh",
      "hasJsxRuntime"
    ),
  },
});

let injectedBabelLoader = false;
function crossRules(rules) {
  for (const rule of rules) {
    if (typeof rule.loader === "string" && rule.loader.includes("css-loader")) {
      if (rule.options && rule.options.modules && typeof rule.options.modules.getLocalIdent === "function") {
        const nextGetLocalIdent = rule.options.modules.getLocalIdent;
        rule.options.modules.mode = "local";
        rule.options.modules.auto = true;
        rule.options.modules.exportGlobals = true;
        rule.options.modules.exportOnlyLocals = true;
        rule.options.modules.getLocalIdent = (context, _, exportName, options) => {
          if (context.resourcePath.includes(".linaria.module.css")) {
            return exportName;
          }
          return nextGetLocalIdent(context, _, exportName, options);
        };
      }
    }

    if (typeof rule.use === "object") {
      if (Array.isArray(rule.use)) {
        const babelLoaderIndex = rule.use.findIndex(
          ({ loader }) => typeof loader === "string" && loader.includes(BABEL_LOADER_STRING)
        );

        const babelLoaderItem = rule.use[babelLoaderIndex];

        if (babelLoaderIndex !== -1) {
          rule.use = [
            ...rule.use.slice(0, babelLoaderIndex),
            babelLoaderItem,
            makeLinariaLoaderConfig(babelLoaderItem.options),
            ...rule.use.slice(babelLoaderIndex + 2),
          ];
          injectedBabelLoader = true;
        }
      } else if (typeof rule.use.loader === "string" && rule.use.loader.includes(BABEL_LOADER_STRING)) {
        rule.use = [rule.use, makeLinariaLoaderConfig(rule.use.options)];
        injectedBabelLoader = true;
      }

      crossRules(Array.isArray(rule.use) ? rule.use : [rule.use]);
    }

    if (Array.isArray(rule.oneOf)) {
      crossRules(rule.oneOf);
    }
  }
}

function withLinaria(nextConfig = {}) {
  return {
    ...nextConfig,
    webpack(config, options) {
      crossRules(config.module.rules);

      if (!injectedBabelLoader) {
        config.module.rules.push({
          test: /\.(tsx?|jsx?)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: linariaWebpackLoaderConfig.options.babelOptions,
            },
            linariaWebpackLoaderConfig,
          ],
        });
      }

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  };
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = withLinaria(nextConfig);
