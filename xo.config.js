import globals from 'globals';

/**
@type {import('xo').FlatXoConfig}
*/
const xoConfig = [
	{
		ignores: ['source/demo/package.json', 'source/demo/*.html'],
	},
	{
		// Mocks (`sinon-chrome`) are loosely typed
		files: ['source/**/*.test.ts'],
		rules: {
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/strict-void-return': 'off',
			// Tests need to cover `http:` URLs
			'unicorn/prefer-https': 'off',
		},
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				chrome: 'readonly',
			},
		},
		rules: {
			'unicorn/prefer-top-level-await': 'off',
			'regexp/no-useless-character-class': 'off',
			'unicorn/prefer-string-replace-all': 'off',
		},
	},
];

export default xoConfig;
