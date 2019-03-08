/* eslint-disable react/prop-types */
import EventEmitter from 'events';
import React, {useState} from 'react';
import test from 'ava';
import chalk from 'chalk';
import {spy} from 'sinon';
import {Box, Color, Static, StdinContext, render} from '..';
import renderToString from './helpers/render-to-string';

test('text', t => {
	const output = renderToString(<Box>Hello World</Box>);

	t.is(output, 'Hello World');
});

test('text with variable', t => {
	const output = renderToString(<Box>Count: {1}</Box>);

	t.is(output, 'Count: 1');
});

test('multiple text nodes', t => {
	const output = renderToString(
		<Box>
			{'Hello'}
			{' World'}
		</Box>
	);

	t.is(output, 'Hello World');
});

test('text with component', t => {
	const World = () => <Box>World</Box>;

	const output = renderToString(
		<Box>
			Hello <World/>
		</Box>
	);

	t.is(output, 'Hello World');
});

test('text with fragment', t => {
	const output = renderToString(
		<Box>
			Hello <>World</>
		</Box>
	);

	t.is(output, 'Hello World');
});

test('number', t => {
	const output = renderToString(<Box>{1}</Box>);

	t.is(output, '1');
});

test('fragment', t => {
	const output = renderToString(<>Hello World</>);

	t.is(output, 'Hello World');
});

test('transform children', t => {
	const output = renderToString(
		<Box unstable__transformChildren={str => `[${str}]`}>
			<Box unstable__transformChildren={str => `{${str}}`}>test</Box>
		</Box>
	);

	t.is(output, '[{test}]');
});

test('apply transform once to multiple text children', t => {
	const output = renderToString(
		<Box unstable__transformChildren={str => `[${str}]`}>
			<Box unstable__transformChildren={str => `{${str}}`}>
				hello{' '}world
			</Box>
		</Box>
	);

	t.is(output, '[{hello world}]');
});

test('hooks', t => {
	const WithHooks = () => {
		const [value] = useState('Hello');

		return (
			<Box>{value}</Box>
		);
	};

	const output = renderToString(<WithHooks/>);
	t.is(output, 'Hello');
});

test('static output', t => {
	const output = renderToString(
		<Box>
			<Static paddingBottom={1}>
				<Box key="a">A</Box>
				<Box key="b">B</Box>
				<Box key="c">C</Box>
			</Static>

			<Box marginTop={1}>
				X
			</Box>
		</Box>
	);

	t.is(output, 'A\nB\nC\n\n\nX');
});

// See https://github.com/chalk/wrap-ansi/issues/27
test('ensure wrap-ansi doesn\'t trim leading whitespace', t => {
	const output = renderToString(
		<Color red>
			{' ERROR '}
		</Color>
	);

	t.is(output, chalk.red(' ERROR '));
});

test('replace child node with text', t => {
	const stdout = {
		write: spy(),
		columns: 100
	};

	const Dynamic = ({replace}) => (
		<Box>
			{replace ? 'x' : <Color green>test</Color>}
		</Box>
	);

	const {rerender} = render(<Dynamic/>, {
		stdout,
		debug: true
	});

	t.is(stdout.write.lastCall.args[0], chalk.green('test'));

	rerender(<Dynamic replace/>);
	t.is(stdout.write.lastCall.args[0], 'x');
});

// See https://github.com/vadimdemedes/ink/issues/145
test('disable raw mode when all input components are unmounted', t => {
	const stdout = {
		write: spy(),
		columns: 100
	};

	const stdin = new EventEmitter();
	stdin.setEncoding = () => {};
	stdin.setRawMode = spy();
	stdin.resume = spy();
	stdin.pause = spy();

	const options = {
		stdout,
		stdin,
		debug: true
	};

	class Input extends React.Component {
		render() {
			return <Box>Test</Box>;
		}

		componentDidMount() {
			this.props.setRawMode(true);
		}

		componentWillUnmount() {
			this.props.setRawMode(false);
		}
	}

	const Test = ({renderFirstInput, renderSecondInput}) => (
		<StdinContext.Consumer>
			{({setRawMode}) => (
				<>
					{renderFirstInput && <Input setRawMode={setRawMode}/>}
					{renderSecondInput && <Input setRawMode={setRawMode}/>}
				</>
			)}
		</StdinContext.Consumer>
	);

	const {rerender} = render(<Test renderFirstInput renderSecondInput/>, options);

	t.true(stdin.setRawMode.calledOnce);
	t.deepEqual(stdin.setRawMode.firstCall.args, [true]);
	t.true(stdin.resume.calledOnce);
	t.false(stdin.pause.called);

	rerender(<Test renderFirstInput/>);

	t.true(stdin.setRawMode.calledOnce);
	t.true(stdin.resume.calledOnce);
	t.false(stdin.pause.called);

	rerender(<Test/>);

	t.true(stdin.setRawMode.calledTwice);
	t.deepEqual(stdin.setRawMode.lastCall.args, [false]);
	t.true(stdin.resume.calledOnce);
	t.true(stdin.pause.calledOnce);
});
