type CleanPathname<T extends string> = T extends `${string}${'#' | '?'}${string}` ? never : T;

export type ExtensionUrlDetails = {
	pathname?: string;
	hash?: string;
	searchParams?: Record<string, string>;
};

export function getExtensionUrl<T extends string>(pathname: CleanPathname<T>): string;
export function getExtensionUrl(details: ExtensionUrlDetails): string;
export function getExtensionUrl<T extends string>(
	pathnameOrDetails: CleanPathname<T> | ExtensionUrlDetails,
): string {
	if (typeof pathnameOrDetails === 'string') {
		return chrome.runtime.getURL(pathnameOrDetails);
	}

	const {pathname, hash, searchParams} = pathnameOrDetails;
	const url = new URL(chrome.runtime.getURL(pathname ?? ''));

	if (hash) {
		url.hash = hash;
	}

	if (searchParams) {
		for (const [key, value] of Object.entries(searchParams)) {
			url.searchParams.set(key, value);
		}
	}

	return url.toString();
}
