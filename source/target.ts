export type Target = {
	tabId: number;
	frameId: number;
};

export function castTarget(target: number | Target): Target {
	return typeof target === 'object'
		? target
		: {
			tabId: target,
			frameId: 0,
		};
}
