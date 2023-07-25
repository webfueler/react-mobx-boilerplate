import "webpack-dev-server"; // required for typings
import path from "node:path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import type { Configuration } from "webpack";

const isProduction = process.env.NODE_ENV !== "development";

const customWebpackConfig = async (): Promise<Configuration> => {
	const config: Configuration = {
		entry: path.resolve(__dirname, "src/index.tsx"),
		output: {
			clean: true,
			filename: isProduction ? "[name].[fullhash].js" : "index.js",
			path: path.resolve(__dirname, "dist"),
			publicPath: "/",
		},
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
				: []),
			new HtmlWebpackPlugin({ template: "src/index.html" }),
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
				: {}),
		},
		devServer: {
			historyApiFallback: {
				index: "/index.html",
			},
		},
	};

	return config;
};

export default customWebpackConfig();
