import "webpack-dev-server"; // required for typings
import path from "node:path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import WebpackAssetsManifest from "webpack-assets-manifest";
import type { Configuration } from "webpack";
import nodeExternals from "webpack-node-externals";
import { DefinePlugin, HotModuleReplacementPlugin } from "webpack";

const isProduction = process.env.NODE_ENV !== "development";

const clientConfig: Configuration = {
	entry: {
		app: [
			path.resolve(__dirname, "src/entry-client.tsx"),
			// isProduction ? "" : "webpack-hot-middleware/client",
		].filter((value) => value !== ""),
	},
	output: {
		filename: isProduction ? "[name].[fullhash].js" : "client.[id].js",
		path: path.resolve(__dirname, "dist/client"),
		clean: true,
	},
	watchOptions: {
		ignored: ["**/src/server/**/*"],
	},
	devtool: isProduction ? "source-map" : "eval-source-map",
	mode: isProduction ? "production" : "development",
	module: {
		rules: [
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					isProduction ? MiniCssExtractPlugin.loader : "style-loader",
					{
						loader: "css-loader",
						options: {
							modules: false,
						},
					},
					"resolve-url-loader",
					{
						loader: "sass-loader",
						options: {
							sourceMap: true,
						},
					},
				],
			},
			{
				test: /\.(png|jpe?g|gif)$/i,
				use: [
					{
						loader: "file-loader",
						options: {
							name: "[name].[ext]",
						},
					},
				],
			},
			{
				test: /\.(ts)x?$/,
				use: ["babel-loader", "ts-loader"],
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
	},
	plugins: [
		...(isProduction
			? [
					new MiniCssExtractPlugin({
						filename: "[name].[contenthash].css",
					}),
					new BundleAnalyzerPlugin({
						analyzerMode: "static",
						reportFilename: "client-bundle-report.html",
						openAnalyzer: false,
					}),
			  ]
			: [
					/* new HotModuleReplacementPlugin() */
			  ]),
		new DefinePlugin({
			__isBrowser__: "true",
		}),
		new WebpackAssetsManifest(),
	],
	optimization: {
		minimize: isProduction,
		...(isProduction
			? {
					splitChunks: {
						cacheGroups: {
							commons: {
								test: /[/\\]node_modules[/\\]/,
								name: "vendors",
								chunks: "all",
							},
						},
					},
			  }
			: {
					runtimeChunk: "single",
			  }),
	},
};

const serverConfig: Configuration = {
	mode: "production",
	entry: "./src/server/index.tsx",
	target: "node",
	externals: [nodeExternals()],
	output: {
		path: path.resolve(__dirname, "dist/server"),
		filename: "index.js",
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.(sa|sc|c)ss$/,
				loader: "ignore-loader",
			},
			{
				test: /\.(ts)x?$/,
				use: ["babel-loader", "ts-loader"],
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "server.css",
		}),
		new DefinePlugin({
			__isBrowser__: "false",
		}),
		// !isProduction && new HotModuleReplacementPlugin(),
	].filter(Boolean),
};

export { clientConfig, serverConfig };
export default clientConfig;
