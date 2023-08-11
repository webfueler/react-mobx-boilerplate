import "webpack-dev-server"; // required for typings
import path from "node:path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { WebpackManifestPlugin } from "webpack-manifest-plugin";
import type { Configuration } from "webpack";
import nodeExternals from "webpack-node-externals";
import { DefinePlugin, HotModuleReplacementPlugin } from "webpack";
import { config } from "dotenv";

config();

const isProduction = process.env.NODE_ENV !== "development";
const distFolder = "dist";

const clientConfig: Configuration = {
	entry: {
		app: [
			path.resolve(process.cwd(), "client/src/entry-client.tsx"),
			// isProduction ? "" : "webpack-hot-middleware/client",
		].filter((value) => value !== ""),
	},
	output: {
		filename: isProduction ? "[name].[fullhash].js" : "client.[id].js",
		path: path.resolve(process.cwd(), `${distFolder}/client`),
		publicPath: process.env.PUBLIC_PATH || "/",
		clean: true,
	},
	watchOptions: {
		ignored: ["**/server/**/*"],
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
		new WebpackManifestPlugin({}),
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
	entry: path.resolve(process.cwd(), "server/src/entry-server.tsx"),
	target: "node",
	externals: [nodeExternals()],
	output: {
		path: path.resolve(process.cwd(), `${distFolder}/server`),
		filename: "index.js",
		publicPath: process.env.PUBLIC_PATH || "/",
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
	optimization: {
		nodeEnv: false,
	},
};

export { clientConfig, serverConfig };
