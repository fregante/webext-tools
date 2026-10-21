export const sleep = async (ms: number) => new Promise(resolve => {
	setTimeout(resolve, ms, ms);
});

declare module 'vitest' {
	/* eslint-disable @typescript-eslint/consistent-type-definitions -- Interface merging requires the same type parameters as the original */
	interface Matchers<R extends void | Promise<void> = void | Promise<void>, T = unknown> {
		toBePending: () => Promise<void>;
	}
	/* eslint-enable @typescript-eslint/consistent-type-definitions */
}
