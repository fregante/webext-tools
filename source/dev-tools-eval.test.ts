import assert from 'node:assert/strict';
import {it, beforeEach} from 'node:test';
import chrome from 'sinon-chrome';
import devToolsEval from './dev-tools-eval.js';

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
	evalStub.resetHistory();
});

it('returns the result of a successful eval', async () => {
	evalStub.yields('result', noError);

	assert.equal(await devToolsEval('1 + 1'), 'result');
});

it('throws on a DevTools-side error with printf substitution', async () => {
	evalStub.yields(undefined, {
		isError: true,
		code: 'E_SOME_ERROR',
		description: 'Error: %s',
		details: ['bad input'],
		isException: false,
		value: '',
	});

	await assert.rejects(devToolsEval('bad'), {message: 'Error: bad input'});
});

it('resolves with a non-string result', async () => {
	evalStub.yields(42, noError);

	assert.equal(await devToolsEval<number>('42'), 42);
});
