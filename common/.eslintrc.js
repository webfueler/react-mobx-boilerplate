const path = require("node:path");

/** @type import("eslint").Linter.Config */
const config = {
	extends: ["../.eslintrc"],
	parserOptions: {
		project: path.join(__dirname, "tsconfig.json"),
	},
};

module.exports = config;
