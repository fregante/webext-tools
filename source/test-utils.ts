export const sleep = async (ms: number) => new Promise(resolve => {
	setTimeout(resolve, ms, ms);
});

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace -- It is what it is
	namespace jest {
		// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- It is what it is
		interface Matchers<R> {
			toBePending(): Promise<R>;
		}
	}
}
