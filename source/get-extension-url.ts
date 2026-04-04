type CleanPathname<T extends string> = T extends `${string}${'#' | '?'}${string}` ? never : T;

export type ExtensionUrlOptions = {
	hash?: string;
	searchParams?: Record<string, string>;
};

export function getExtensionUrl<T extends string>(
	pathname: CleanPathname<T>,
	options?: ExtensionUrlOptions,
): URL {
	const url = new URL(chrome.runtime.getURL(pathname));

	if (options?.hash) {
		url.hash = options.hash;
	}

	if (options?.searchParams) {
		for (const [key, value] of Object.entries(options.searchParams)) {
			url.searchParams.set(key, value);
		}
	}

	return url;
}
