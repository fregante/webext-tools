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
			// `node:test` registers tests synchronously and returns promises
			// TODO: Drop in 2027
			'@typescript-eslint/no-floating-promises': 'off',
			// Tests need to cover `http:` URLs
			'unicorn/prefer-https': 'off',
		},
	},
];

export default xoConfig;
