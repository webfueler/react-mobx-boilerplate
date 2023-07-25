/** @type import("eslint").Linter.Config */
const config = {
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:react-hooks/recommended",
		"plugin:unicorn/recommended",
		"plugin:@typescript-eslint/recommended",
	],
	env: {
		browser: true,
		node: true,
	},
	plugins: ["unicorn", "@typescript-eslint", "react", "react-hooks"],
	parser: "@typescript-eslint/parser",
	ignorePatterns: ["dist", "node_modules"],
	parserOptions: {
		project: true,
	},
	settings: {
		react: {
			version: "detect",
		},
	},
	rules: {
		"no-mixed-spaces-and-tabs": "off",
		"@typescript-eslint/explicit-function-return-type": "error",
		"@typescript-eslint/no-unused-vars": [
			"warn",
			{
				varsIgnorePattern: "^_",
				destructuredArrayIgnorePattern: "^_",
				argsIgnorePattern: "^_",
			},
		],
		"react/prop-types": "off",
		"unicorn/prevent-abbreviations": "off",
		"unicorn/prefer-module": "off",
		"unicorn/no-null": "off",
		"unicorn/expiring-todo-comments": "off",
		"unicorn/no-useless-undefined": ["error", { checkArguments: false }],
		"unicorn/filename-case": [
			"error",
			{
				cases: {
					pascalCase: true,
					kebabCase: true,
				},
			},
		],
	},
	root: true,
	overrides: [
		{
			files: ["*.js", "*.jsx"],
			rules: {
				"@typescript-eslint/explicit-function-return-type": "off",
				"@typescript-eslint/no-var-requires": "off",
				"@typescript-eslint/no-unsafe-assignment": "off",
			},
		},
	],
};

module.exports = config;
