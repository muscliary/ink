<h1 align="center">
	<br>
	<br>
	<img width="300" alt="Ink" src="media/logo.png">
	<br>
	<br>
	<br>
</h1>

> React for CLIs. Build and test your CLI output using components.

![Build Status](https://github.com/vadimdemedes/ink/workflows/tests/badge.svg)

## Install

```
$ npm install ink react
```

## Usage

```jsx
import React, {useState, useEffect} from 'react';
import {render, Color} from 'ink';

const Counter = () => {
	const [counter, setCounter] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setCounter(previousCounter => previousCounter + 1);
		}, 100);

		return () => {
			clearInterval(timer);
		};
	}, []);

	return <Color green>{counter} tests passed</Color>;
};

render(<Counter />);
```

<img src="media/demo.svg" width="600">

You can also check it out live on [repl.it sandbox](https://ink-counter-demo.vadimdemedes.repl.run/).
Feel free to play around with the code and fork this repl at [https://repl.it/@vadimdemedes/ink-counter-demo](https://repl.it/@vadimdemedes/ink-counter-demo).

## Who's Using Ink?

- [Gatsby](https://www.gatsbyjs.org) - Gatsby is a modern web framework for blazing fast websites.
- [Parcel](https://parceljs.org) - Blazing fast, zero configuration web application bundler.
- [tap](https://node-tap.org) - A Test-Anything-Protocol library for JavaScript.
- [Typewriter](https://github.com/segmentio/typewriter) - Generates strongly-typed [Segment](https://segment.com) analytics clients from arbitrary JSON Schema.
- [Prisma](https://www.prisma.io) - The unified data layer for modern applications.
- [Wallace](https://www.projectwallace.com) - Pretty CSS analytics on the CLI.
- [tink](https://github.com/npm/tink) - Next-generation runtime and package manager.
- [Splash](https://github.com/Shopify/polaris-react/tree/master/scripts/splash) - Observe the splash zone of a change across the Shopify's [Polaris](https://polaris.shopify.com) component library.
- [emoj](https://github.com/sindresorhus/emoj) - Find relevant emoji on the command-line.
- [emma](https://github.com/maticzav/emma-cli) - Terminal assistant to find and install npm packages.
- [sindresorhus](https://github.com/sindresorhus/sindresorhus) - The Sindre Sorhus CLI.
- [swiff](https://github.com/simple-integrated-marketing/swiff) - Multi-environment command line tools for time-saving web developers.
- [share](https://github.com/marionebl/share-cli) - Quickly share files from your command line.
- [Kubelive](https://github.com/ameerthehacker/kubelive) - CLI for Kubernetes to provide live data about the cluster and its resources.
- [changelog-view](https://github.com/jdeniau/changelog-view) - Tool view changelog in console.
- [gomoku-terminal](https://github.com/acrazing/gomoku-terminal) - Play online Gomoku in the terminal.
- [cfpush](https://github.com/mamachanko/cfpush) - An interactive Cloud Foundry tutorial in your terminal.
- [startd](https://github.com/mgrip/startd) - Turn your React component into a web app from the command-line.
- [wiki-cli](https://github.com/hexrcs/wiki-cli) - Search Wikipedia and read summaries directly in your terminal.
- [garson](https://github.com/goliney/garson) - Build interactive config-based command-line interfaces.

## Contents

- [Getting Started](#getting-started)
- [Examples](#examples)
- [API](#api)
- [Building Layouts](#building-layouts)
- [Built-in Components](#built-in-components)
- [Hooks](#hooks)
- [Useful Components](#useful-components)
- [Testing](#testing)
- [Using React Devtools](#using-react-devtools)

## Getting Started

Ink's goal is to provide the same component-based UI building experience that React provides, but for command-line apps. It uses [yoga-layout](https://github.com/facebook/yoga) to allow Flexbox layouts in the terminal. If you are already familiar with React, you already know Ink.

The key difference you have to remember is that the rendering result isn't a DOM, but a string, which Ink writes to the output.

To get started with Ink quickly, use [create-ink-app](https://github.com/vadimdemedes/create-ink-app) to quickly scaffold a new Ink-based CLI. Alternatively, here's how to configure Babel to work with Ink. To ensure all examples work and you can begin your adventure, make sure to set up Babel with a React preset. After [installing Babel](https://babeljs.io/docs/en/usage), configure it in `package.json`:

```json
{
	"babel": {
		"presets": [
			"@babel/preset-react",
			[
				"@babel/preset-env",
				{
					"targets": {
						"node": true
					}
				}
			]
		]
	}
}
```

Don't forget to import `React` into every file that contains JSX:

```jsx
import React from 'react';
import {render, Box} from 'ink';

const Demo = () => <Box>Hello World</Box>;

render(<Demo />);
```

## Examples

- [Jest](examples/jest/jest.js) - Implementation of basic Jest UI [(live demo)](https://ink-jest-demo.vadimdemedes.repl.run/).
- [Counter](examples/counter/counter.js) - Simple counter that increments every 100ms [(live demo)](https://ink-counter-demo.vadimdemedes.repl.run/).
- [Form with Validation](https://github.com/final-form/rff-cli-example) - Using framework agnostic form library, [🏁 Final Form](https://github.com/final-form/final-form#-final-form) to manage input state.

## API

Since Ink is a React renderer, it means that all features of React are supported.
Head over to [React](https://reactjs.org) website for documentation on how to use it.
In this readme only Ink's methods will be documented.

#### render(tree, options)

Returns: `Instance`

Mount a component and render the output.

##### tree

Type: `ReactElement`

##### options

Type: `Object`

###### stdout

Type: `stream.Writable`<br>
Default: `process.stdout`

Output stream where app will be rendered.

###### stdin

Type: `stream.Readable`<br>
Default: `process.stdin`

Input stream where app will listen for input.

###### exitOnCtrlC

Type: `boolean`<br>
Default: `true`

Configure whether Ink should listen to Ctrl+C keyboard input and exit the app.
This is needed in case `process.stdin` is in [raw mode](https://nodejs.org/api/tty.html#tty_readstream_setrawmode_mode), because then Ctrl+C is ignored by default and process is expected to handle it manually.

###### debug

Type: `boolean`<br>
Default: `false`

If `true`, each update will be rendered as a separate output, without replacing the previous one.

There's also a shortcut to avoid passing `options` object:

```jsx
render(<Counter>, process.stdout);
```

#### Instance

This is the object that `render()` returns.

##### rerender

Replace previous root node with a new one or update props of the current root node.

```jsx
// Update props of the root node
const {rerender} = render(<Counter count={1} />);
rerender(<Counter count={2} />);

// Replace root node
const {rerender} = render(<OldCounter />);
rerender(<NewCounter />);
```

##### unmount

Manually unmount the whole Ink app.

```jsx
const {unmount} = render(<MyApp />);
unmount();
```

##### waitUntilExit

Returns a promise, which resolves when app is unmounted.

```jsx
const {unmount, waitUntilExit} = render(<MyApp />);

setTimeout(unmount, 1000);

await waitUntilExit(); // resolves after `unmount()` is called
```

##### clear

Clear output.

```jsx
const {clear} = render(<MyApp />);
clear();
```

## Building Layouts

Ink uses [Yoga](https://github.com/facebook/yoga) - a Flexbox layout engine to build great user interfaces for your CLIs.
It's important to remember that each element is a Flexbox container.
Think of it as if each `<div>` in the browser had `display: flex`.
See `<Box>` built-in component below for documentation on how to use Flexbox layouts in Ink.

### Built-in Components

#### `<Box>`

`<Box>` it's an essential Ink component to build your layout. It's like a `<div style="display: flex">` in a browser.

Import:

```js
import {Box} from 'ink';
```

##### Dimensions

###### width

Type: `number`, `string`

Width of the element in spaces. You can also set it in percent, which will calculate the width based on the width of parent element.

```jsx
<Box width={4}>X</Box> //=> 'X   '
```

```jsx
<Box width={10}>
	<Box width="50%">X</Box>Y
</Box> //=> 'X    Y'
```

###### height

Type: `number`, `string`

Height of the element in lines (rows). You can also set it in percent, which will calculate the height based on the height of parent element.

```jsx
<Box height={4}>X</Box> //=> 'X\n\n\n'
```

```jsx
<Box height={6} flexDirection="column">
	<Box height="50%">X</Box>Y
</Box> //=> 'X\n\n\nY\n\n'
```

###### minWidth

Type: `number`

Sets a minimum width of the element. Percentages aren't supported yet, see https://github.com/facebook/yoga/issues/872.

###### minHeight

Type: `number`

Sets a minimum height of the element. Percentages aren't supported yet, see https://github.com/facebook/yoga/issues/872.

##### Wrapping

###### textWrap

Type: `string`<br>
Values: `wrap` `truncate` `truncate-start` `truncate-middle` `truncate-end`<br>
Default: `wrap`

This property tells Ink to wrap or truncate text content of `<Box>` if its width is larger than container.
If `wrap` is passed (by default), Ink will wrap text and split it into multiple lines.
If `truncate-*` is passed, Ink will truncate text instead, which will result in one line of text with the rest cut off.

```jsx
<Box>Hello World</Box>
//=> 'Hello\nWorld'

// `truncate` is an alias to `truncate-end`
<Box textWrap="truncate">Hello World</Box>
//=> 'Hello…'

<Box textWrap="truncate-middle">Hello World</Box>
//=> 'He…ld'

<Box textWrap="truncate-start">Hello World</Box>
//=> '…World'
```

##### Padding

###### paddingTop

Type: `number`<br>
Default: `0`

###### paddingBottom

Type: `number`<br>
Default: `0`

###### paddingLeft

Type: `number`<br>
Default: `0`

###### paddingRight

Type: `number`<br>
Default: `0`

###### paddingX

Type: `number`<br>
Default: `0`

###### paddingY

Type: `number`<br>
Default: `0`

###### padding

Type: `number`<br>
Default: `0`

```jsx
<Box paddingTop={2}>Top</Box>
<Box paddingBottom={2}>Bottom</Box>
<Box paddingLeft={2}>Left</Box>
<Box paddingRight={2}>Right</Box>
<Box paddingX={2}>Left and right</Box>
<Box paddingY={2}>Top and bottom</Box>
<Box padding={2}>Top, bottom, left and right</Box>
```

##### Margin

###### marginTop

Type: `number`<br>
Default: `0`

###### marginBottom

Type: `number`<br>
Default: `0`

###### marginLeft

Type: `number`<br>
Default: `0`

###### marginRight

Type: `number`<br>
Default: `0`

###### marginX

Type: `number`<br>
Default: `0`

###### marginY

Type: `number`<br>
Default: `0`

###### margin

Type: `number`<br>
Default: `0`

```jsx
<Box marginTop={2}>Top</Box>
<Box marginBottom={2}>Bottom</Box>
<Box marginLeft={2}>Left</Box>
<Box marginRight={2}>Right</Box>
<Box marginX={2}>Left and right</Box>
<Box marginY={2}>Top and bottom</Box>
<Box margin={2}>Top, bottom, left and right</Box>
```

##### Flex

###### flexGrow

Type: `number`<br>
Default: `0`

See [flex-grow](https://css-tricks.com/almanac/properties/f/flex-grow/).

```jsx
<Box>
	Label:
	<Box flexGrow={1}>Fills all remaining space</Box>
</Box>
```

###### flexShrink

Type: `number`<br>
Default: `1`

See [flex-shrink](https://css-tricks.com/almanac/properties/f/flex-shrink/).

```jsx
<Box width={20}>
	<Box flexShrink={2} width={10}>
		Will be 1/4
	</Box>
	<Box width={10}>Will be 3/4</Box>
</Box>
```

###### flexBasis

Type: `number`, `string`<br>

See [flex-basis](https://css-tricks.com/almanac/properties/f/flex-basis/).

```jsx
<Box width={6}>
	<Box flexBasis={3}>X</Box>Y
</Box> //=> 'X  Y'
```

```jsx
<Box width={6}>
	<Box flexBasis="50%">X</Box>Y
</Box> //=> 'X  Y'
```

###### flexDirection

Type: `string`<br>
Allowed values: `row`, `row-reverse`, `column` and `column-reverse`

See [flex-direction](https://css-tricks.com/almanac/properties/f/flex-direction/).

```jsx
<Box>
	<Box marginRight={1}>X</Box>
	<Box>Y</Box>
</Box>
// X Y

<Box flexDirection="row-reverse">
	<Box>X</Box>
	<Box marginRight={1}>Y</Box>
</Box>
// Y X

<Box flexDirection="column">
	<Box>X</Box>
	<Box>Y</Box>
</Box>
// X
// Y

<Box flexDirection="column-reverse">
	<Box>X</Box>
	<Box>Y</Box>
</Box>
// Y
// X
```

###### alignItems

Type: `string`<br>
Allowed values: `flex-start`, `center` and `flex-end`

See [align-items](https://css-tricks.com/almanac/properties/f/align-items/).

```jsx
<Box alignItems="flex-start">
	<Box marginRight={1}>X</Box>
	<Box>{`A\nB\nC`}</Box>
</Box>
// X A
//   B
//   C

<Box alignItems="center">
	<Box marginRight={1}>X</Box>
	<Box>{`A\nB\nC`}</Box>
</Box>
//   A
// X B
//   C

<Box alignItems="flex-end">
	<Box marginRight={1}>X</Box>
	<Box>{`A\nB\nC`}</Box>
</Box>
//   A
//   B
// X C
```

###### alignSelf

Type: `string`<br>
Default: `auto`<br>
Allowed vales: `auto`, `flex-start`, `center` and `flex-end`

See [align-self](https://css-tricks.com/almanac/properties/f/align-self/).

```jsx
<Box height={3}>
	<Box alignSelf="flex-start">X</Box>
</Box>
// X
//
//

<Box height={3}>
	<Box alignSelf="center">X</Box>
</Box>
//
// X
//

<Box height={3}>
	<Box alignSelf="flex-end">X</Box>
</Box>
//
//
// X
```

###### justifyContent

Type: `string`<br>
Allowed values: `flex-start`, `center`, `flex-end`, `space-between` and `space-around`.

See [justify-content](https://css-tricks.com/almanac/properties/f/justify-content/).

```jsx
<Box justifyContent="flex-start">
	<Box>X</Box>
</Box>
// [X      ]

<Box justifyContent="center">
	<Box>X</Box>
</Box>
// [   X   ]

<Box justifyContent="flex-end">
	<Box>X</Box>
</Box>
// [      X]

<Box justifyContent="space-between">
	<Box>X</Box>
	<Box>Y</Box>
</Box>
// [X      Y]

<Box justifyContent="space-around">
	<Box>X</Box>
	<Box>Y</Box>
</Box>
// [  X   Y  ]
```

##### Visibility

###### display

Type: `string`<br>
Allowed values: `flex` and `none`<br>
Default: `flex`

#### `<Color>`

The `<Color>` component is a simple wrapper around [the `chalk` API](https://github.com/chalk/chalk#api).
It supports all of the chalk's methods as `props`.

Import:

```js
import {Color} from 'ink';
```

Usage:

```jsx
<Color rgb={[255, 255, 255]} bgKeyword="magenta">
	Hello!
</Color>

<Color hex="#000000" bgHex="#FFFFFF">
	Hey there
</Color>

<Color blue>
	I'm blue
</Color>
```

#### `<Text>`

This component can change the style of the text, make it bold, underline, italic or strikethrough.

Import:

```js
import {Text} from 'ink';
```

##### bold

Type: `boolean`<br>
Default: `false`

##### italic

Type: `boolean`<br>
Default: `false`

##### underline

Type: `boolean`<br>
Default: `false`

##### strikethrough

Type: `boolean`<br>
Default: `false`

Usage:

```jsx
<Text bold>I am bold</Text>
<Text italic>I am italic</Text>
<Text underline>I am underline</Text>
<Text strikethrough>I am strikethrough</Text>
```

#### `<Newline>`

Adds a newline (`\n`) character.

##### count

Type: `number`<br>
Default: `1`

Number of newlines to insert.

Usage:

```jsx
import {Box, Color, Newline} from 'ink';

const Example = () => (
	<Box>
		<Color green>Hello</Color>
		<Newline />
		<Color red>World</Color>
	</Box>
);
```

This will output:

```
Hello
World
```

#### `<Spacer>`

A flexible space that expands along the major axis of its containing layout.
It's useful as a shortcut for filling all the available spaces between elements.

For example, using `<Spacer>` in a `<Box>` with default flex direction (`row`) will position "Left" on the left side and will push "Right" to the right side.

```jsx
import {Box, Spacer} from 'ink';

const Example = () => (
	<Box>
		Left
		<Spacer />
		Right
	</Box>
);
```

In a vertical flex direction (`column`), it will position "Top" to the top of the container and push "Bottom" to the bottom of it.
Note, that container needs to be tall to enough to see this in effect.

```jsx
import {Box, Spacer} from 'ink';

const Example = () => (
	<Box flexDirection="column" height={10}>
		Top
		<Spacer />
		Bottom
	</Box>
);
```

#### `<Static>`

`<Static>` component permanently renders its output above everything else.
It's useful for displaying activity like completed tasks or logs - things that
are not changing after they're rendered (hence the name "Static").

It's preferred to use `<Static>` for use cases like these, when you can't know
or control the amount of items that need to be rendered.

For example, [Tap](https://github.com/tapjs/node-tap) uses `<Static>` to display
a list of completed tests. [Gatsby](https://github.com/gatsbyjs/gatsby) uses it
to display a list of generated pages, while still displaying a live progress bar.

```jsx
<>
	<Static items={tests}>
		{test => <Test key={test.id} title={test.title} />}
	</Static>

	<Box marginTop={1}>
		<TestResults passed={results.passed} failed={results.failed} />
	</Box>
</>
```

**Note:** `<Static>` only renders new items in `items` prop and ignores items
that were previously rendered. This means that when you add new items to `items`
array, changes you make to previous items will not trigger a rerender.

See [examples/jest](examples/jest/jest.js) for a basic implementation of Jest's
UI using `<Static>` component.

##### items

Type: `Array`

Array of items of any type to render using a function you pass as a component child.

##### style

Type: `object`

Styles to apply to a container of child elements.
See [`<Box>`](#box) for supported properties.

```jsx
<Static items={...} style={{padding: 1}}>
	{...}
</Static>
```

##### children

Type: `Function`

Function that is called to render every item in `items` array.
First argument is an item itself and second argument is index of that item in
`items` array.

Note that `key` must be assigned to the root component.

```jsx
<Static items={['a', 'b', 'c']}>
	{(item, index) => {
		// This function is called for every item in ['a', 'b', 'c']
		// `item` is 'a', 'b', 'c'
		// `index` is 0, 1, 2
		return <Box key={index}>Item: {item}</Box>;
	}}
</Static>
```

#### `<Transform>`

Transform a string representation of React components before they are written to output.
For example, you might want to apply a [gradient to text](https://github.com/sindresorhus/ink-gradient), [add a clickable link](https://github.com/sindresorhus/ink-link) or [create some text effects](https://github.com/sindresorhus/ink-big-text).
These use cases can't accept React nodes as input, they are expecting a string.
That's what `<Transform>` component does, it gives you an output string of its child components and lets you transform it in any way.

```jsx
<Transform transform={output => output.toUpperCase()}>
	<Text>Hello World</Text>
</Transform>
```

Since `transform` function converts all characters to upper case, final output that's rendered to the terminal will be "HELLO WORLD", not "Hello World".

##### transform(children)

Type: `Function`

Function which transforms children output.
It accepts children and must return transformed children too.

##### children

Type: `string`

Output of child components.

## Hooks

### useInput(inputHandler, options?)

This hook is used for handling user input.
It's a more convienient alternative to using `useStdin` and listening to `data` events.
The callback you pass to `useInput` is called for each character when user enters any input.
However, if user pastes text and it's more than one character, the callback will be called only once and the whole string will be passed as `input`.
You can find a full example of using `useInput` at [examples/use-input](examples/use-input/use-input.js).

```jsx
import {useInput} from 'ink';

const UserInput = () => {
	useInput((input, key) => {
		if (input === 'q') {
			// Exit program
		}

		if (key.leftArrow) {
			// Left arrow key pressed
		}
	});

	return …
};
```

#### inputHandler

Type: `Function`

The handler function that you pass to `useInput` receives two arguments:

##### input

Type: `string`

The input that the program received.

##### key

Type: `object`

Handy information about a key that was pressed.

###### key.leftArrow

###### key.rightArrow

###### key.upArrow

###### key.downArrow

Type: `boolean`<br>
Default: `false`

If an arrow key was pressed, the corresponding property will be `true`.
For example, if user presses left arrow key, `key.leftArrow` equals `true`.

###### key.return

Type: `boolean`<br>
Default: `false`

Return (Enter) key was pressed.

###### key.ctrl

Type: `boolean`<br>
Default: `false`

Ctrl key was pressed.

###### key.shift

Type: `boolean`<br>
Default: `false`

Shift key was pressed.

###### key.meta

Type: `boolean`<br>
Default: `false`

[Meta key](https://en.wikipedia.org/wiki/Meta_key) was pressed.

#### options

Type: `object`

##### isActive

Type: `boolean`<br>
Default: `true`

Enable or disable capturing of user input.
Useful when there are multiple `useInput` hooks used at once to avoid handling the same input several times.

### useApp

`useApp` is a React hook, which exposes a method to manually exit the app (unmount).

#### exit

Type: `Function`

Exit (unmount) the whole Ink app. If `exit` is called with an `Error`, `waitUntilExit` will reject with that error.

```js
import {useApp} from 'ink';

const Example = () => {
	const {exit} = useApp();

	// Exit the app after 5 seconds
	useEffect(() => {
		setTimeout(() => {
			exit();
		}, 5000);
	}, []);

	return …
};
```

### useStdin

`useStdin` is a React hook, which exposes stdin stream.

#### stdin

Type: `stream.Readable`<br>
Default: `process.stdin`

Stdin stream passed to `render()` in `options.stdin` or `process.stdin` by default.
Useful if your app needs to handle user input.

```js
import {useStdin} from 'ink';

const Example = () => {
	const {stdin} = useStdin();

	return …
};
```

#### isRawModeSupported

Type: `boolean`

A boolean flag determining if the current `stdin` supports `setRawMode`.
A component using `setRawMode` might want to use `isRawModeSupported` to nicely fall back in environments where raw mode is not supported.

Usage:

```jsx
import {useStdin} from 'ink';

const Example = () => {
	const {isRawModeSupported} = useStdin();

	return isRawModeSupported ? (
		<MyInputComponent />
	) : (
		<MyComponentThatDoesntUseInput />
	);
};
```

#### setRawMode

Type: `function`<br>

See [`setRawMode`](https://nodejs.org/api/tty.html#tty_readstream_setrawmode_mode).
Ink exposes this function to be able to handle <kbd>Ctrl</kbd>+<kbd>C</kbd>, that's why you should use Ink's `setRawMode` instead of `process.stdin.setRawMode`.

**Warning:** This function will throw unless the current `stdin` supports `setRawMode`. Use [`isRawModeSupported`](#israwmodesupported) to detect `setRawMode` support.

Usage:

```js
import {useStdin} from 'ink';

const Example = () => {
	const {setRawMode} = useStdin();

	useEffect(() => {
		setRawMode(true);

		return () => {
			setRawMode(false);
		};
	});

	return …
};
```

### useStdout

`useStdout` is a React hook, which exposes stdout stream, where Ink renders your app.

#### stdout

Type: `stream.Writable`<br>
Default: `process.stdout`

Usage:

```js
import {useStdout} from 'ink';

const Example = () => {
	const {stdout} = useStdout;

	return …
};
```

#### write(data)

Write any string to stdout, while preserving Ink's output.
It's useful when you want to display some external information outside of Ink's rendering and ensure there's no conflict between the two.
It's similar to `<Static>`, except it can't accept components, it only works with strings.

##### data

Type: `string`

Data to write to stdout.

```js
import {useStdout} from 'ink';

const Example = () => {
	const {write} = useStdout();

	useEffect(() => {
		// Write a single message to stdout, above Ink's output
		write('Hello from Ink to stdout\n');
	}, []);

	return …
};
```

See additional usage example in [examples/use-stdout](examples/use-stdout/use-stdout.js).

### useStderr

`useStderr` is a React hook, which exposes stderr stream.

#### stderr

Type: `stream.Writable`<br>
Default: `process.stderr`

Stderr stream.

```js
import {useStderr} from 'ink';

const Example = () => {
	const {stderr} = useStderr();

	return …
};
```

#### write(data)

Write any string to stderr, while preserving Ink's output.

It's useful when you want to display some external information outside of Ink's rendering and ensure there's no conflict between the two.
It's similar to `<Static>`, except it can't accept components, it only works with strings.

##### data

Type: `string`

Data to write to stderr.

```js
import {useStderr} from 'ink';

const Example = () => {
	const {write} = useStderr();

	useEffect(() => {
		// Write a single message to stderr, above Ink's output
		write('Hello from Ink to stderr\n');
	}, []);

	return …
};
```

### useFocus(options?)

Component that uses `useFocus` hook becomes "focusable" to Ink, so when user presses <kbd>Tab</kbd>, Ink will switch focus to this component.
If there are multiple components that execute `useFocus` hook, focus will be given to them in the order that these components are rendered in.
This hook returns an object with `isFocused` boolean property, which determines if this component is focused or not.

#### options

##### autoFocus

Type: `boolean`<br>
Default: `false`

Auto focus this component, if there's no active (focused) component right now.

##### isActive

Type: `boolean`<br>
Default: `true`

Enable or disable this component's focus, while still maintaining its position in the list of focusable components.
This is useful for inputs that are temporarily disabled.

```js
import {useFocus} from 'ink';

const Example = () => {
	const {isFocused} = useFocus();

	return <Text>{isFocused ? 'I am focused' : 'I am not focused'}</Text>;
};
```

See example in [examples/use-focus](examples/use-focus/use-focus.js).

### useFocusManager

This hook exposes methods to enable or disable focus management for all components or manually switch focus to next or previous components.

#### enableFocus()

Enable focus management for all components.

**Note:** You don't need to call this method manually, unless you've disabled focus management. Focus management is enabled by default.

```js
import {useFocusManager} from 'ink';

const Example = () => {
	const {enableFocus} = useFocusManager();

	useEffect(() => {
		enableFocus();
	}, []);

	return …
};
```

#### disableFocus()

Disable focus management for all components.
Currently active component (if there's one) will lose its focus.

```js
import {useFocusManager} from 'ink';

const Example = () => {
	const {disableFocus} = useFocusManager();

	useEffect(() => {
		disableFocus();
	}, []);

	return …
};
```

#### focusNext()

Switch focus to the next focusable component.
If there's no active component right now, focus will be given to the first focusable component.
If active component is the last in the list of focusable components, focus will be switched to the first component.

**Note:** Ink calls this method when user presses <kbd>Tab</kbd>.

```js
import {useFocusManager} from 'ink';

const Example = () => {
	const {focusNext} = useFocusManager();

	useEffect(() => {
		focusNext();
	}, []);

	return …
};
```

#### focusPrevious()

Switch focus to the previous focusable component.
If there's no active component right now, focus will be given to the first focusable component.
If active component is the first in the list of focusable components, focus will be switched to the last component.

**Note:** Ink calls this method when user presses <kbd>Shift</kbd>+<kbd>Tab</kbd>.

```js
import {useFocusManager} from 'ink';

const Example = () => {
	const {focusPrevious} = useFocusManager();

	useEffect(() => {
		focusPrevious();
	}, []);

	return …
};
```

## Useful Hooks

- [ink-use-stdout-dimensions](https://github.com/cameronhunter/ink-monorepo/tree/master/packages/ink-use-stdout-dimensions) - Subscribe to stdout dimensions.

## Useful Components

- [ink-text-input](https://github.com/vadimdemedes/ink-text-input) - Text input.
- [ink-spinner](https://github.com/vadimdemedes/ink-spinner) - Spinner.
- [ink-select-input](https://github.com/vadimdemedes/ink-select-input) - Select (dropdown) input.
- [ink-link](https://github.com/sindresorhus/ink-link) - Link component.
- [ink-box](https://github.com/sindresorhus/ink-box) - Styled box component.
- [ink-gradient](https://github.com/sindresorhus/ink-gradient) - Gradient color component.
- [ink-big-text](https://github.com/sindresorhus/ink-big-text) - Awesome text component.
- [ink-image](https://github.com/kevva/ink-image) - Display images inside the terminal.
- [ink-tab](https://github.com/jdeniau/ink-tab) - Tab component.
- [ink-color-pipe](https://github.com/LitoMore/ink-color-pipe) - Create color text with simpler style strings in Ink.
- [ink-multi-select](https://github.com/karaggeorge/ink-multi-select) - Select one or more values from a list
- [ink-divider](https://github.com/JureSotosek/ink-divider) - A divider component.
- [ink-progress-bar](https://github.com/brigand/ink-progress-bar) - Configurable component for rendering progress bars.
- [ink-table](https://github.com/maticzav/ink-table) - Table component.
- [ink-ascii](https://github.com/hexrcs/ink-ascii) - Awesome text component with more font choices, based on Figlet.
- [ink-markdown](https://github.com/cameronhunter/ink-markdown) - Render syntax highlighted Markdown.
- [ink-quicksearch-input](https://github.com/Eximchain/ink-quicksearch-input) - Select component with fast quicksearch-like navigation.
- [ink-confirm-input](https://github.com/kevva/ink-confirm-input) - Yes/No confirmation input.

## Testing

Ink components are simple to test with [ink-testing-library](https://github.com/vadimdemedes/ink-testing-library).
Here's a simple example that checks how component is rendered:

```jsx
import React from 'react';
import {Text} from 'ink';
import {render} from 'ink-testing-library';

const Test = () => <Text>Hello World</Text>;
const {lastFrame} = render(<Test />);

lastFrame() === 'Hello World'; //=> true
```

Visit [ink-testing-library](https://github.com/vadimdemedes/ink-testing-library) for more examples and full documentation.

## Using React Devtools

![](media/devtools.jpg)

Ink supports [React Devtools](https://github.com/facebook/react/tree/master/packages/react-devtools) out-of-the-box.
To enable integration with React Devtools in your Ink-based CLI, run it with `DEV=true` environment variable:

```
$ DEV=true my-cli
```

Then, start React Devtools itself:

```
$ npx react-devtools
```

After it starts up, you should see the component tree of your CLI.
You can even inspect and change the props of components, and see the results immediatelly in the CLI, without restarting it.

**Note**: You must manually quit your CLI via <kbd>Ctrl</kbd>+<kbd>C</kbd> after you're done testing.

## Maintainers

- [Vadim Demedes](https://github.com/vadimdemedes)
- [Sindre Sorhus](https://github.com/sindresorhus)
