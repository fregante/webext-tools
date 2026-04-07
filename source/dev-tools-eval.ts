function printf(string: string, arguments_: string[]): string {
	// eslint-disable-next-line unicorn/no-array-reduce -- Short and already described by "printf"
	return arguments_.reduce(
		(message, part) => message.replace('%s', part),
		string,
	);
}

/** Wrapper around the dev tools' `eval` function to throw proper errors */
// eslint-disable-next-line unicorn/prevent-abbreviations
export async function devToolsEval<T>(code: string): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		chrome.devtools.inspectedWindow.eval<T>(code, (response, error) => {
			// Handle Dev Tools API error response
			// https://developer.chrome.com/docs/extensions/reference/devtools_inspectedWindow/#method-eval
			// https://github.com/pixiebrix/pixiebrix-extension/pull/999#discussion_r684370643
			if (!response && error?.isError) {
				reject(new Error(printf(error.description, error.details as string[])));
				return;
			}

			resolve(response);
		});
	});
}
