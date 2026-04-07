import {expect, it, beforeEach} from 'vitest';
import chrome from 'sinon-chrome';
import {devToolsEval} from './dev-tools-eval.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const evalStub: any = (chrome as any).devtools.inspectedWindow.eval;

const noError: Record<string, unknown> = {
	isError: false,
	code: '',
	description: '',
	details: [],
	isException: false,
	value: '',
};

beforeEach(() => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	evalStub.resetHistory();
});

it('returns the result of a successful eval', async () => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	evalStub.yields('result', noError);

	await expect(devToolsEval('1 + 1')).resolves.toBe('result');
});

it('throws on a DevTools-side error with printf substitution', async () => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	evalStub.yields(undefined, {
		isError: true,
		code: 'E_SOME_ERROR',
		description: 'Error: %s',
		details: ['bad input'],
		isException: false,
		value: '',
	});

	await expect(devToolsEval('bad')).rejects.toThrow('Error: bad input');
});

it('resolves with a non-string result', async () => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	evalStub.yields(42, noError);

	await expect(devToolsEval<number>('42')).resolves.toBe(42);
});
