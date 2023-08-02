/**
 * Babel configuration
 * @param {babel.ConfigAPI} api - babel config api
 * @returns {babel.TransformOptions} the babel configuration to use
 */
const config = (api) => {
	const isDev = api.env() === "development";

	/** @type {babel.TransformOptions} */
	const config = {
		presets: [
			"@babel/preset-env",
			"@babel/preset-react",
			"@babel/preset-typescript",
		],
		plugins: [
			"babel-plugin-transform-typescript-metadata",
			[
				"@babel/plugin-proposal-decorators",
				{
					legacy: true,
				},
			],
			// isDev && "react-refresh/babel",
		].filter(Boolean),
	};

	return config;
};

module.exports = config;
