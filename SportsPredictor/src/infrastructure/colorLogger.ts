// FILE: infrastructure/colorLogger.ts
// _______________________________________________

type ColorName =
	'reset' | 'bold' |
	'black' | 'red' |
	'green' | 'yellow' |
	'blue' | 'magenta' |
	'cyan' | 'white' |
	'dodgerBlue' | 'netflixRed';

// Construct a type with a set of properties K of type T
const colors: Record<ColorName, string> = {
	reset: '\x1b[0m',
	bold: '\x1b[1m',
	black: '\x1b[30m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m',
	white: '\x1b[37m',
	dodgerBlue: '\x1b[38;2;30;144;255m', // RGB for Dodger Blue
	netflixRed: '\x1b[38;2;229;9;20m',  // RGB for Netflix Red
};
// _______________________________________________

export const withConsoleColorLogger = (
	msg: string,
	color: ColorName = 'reset',
	isBold: boolean = false): void => {
	
	const colorCode = colors[ color ];
	const bold = isBold ? colors.bold : '';
	console.log(`${ bold }${ colorCode }${ msg }${ colors.reset }`);
};

export const withColorLogger = (
	msg: string,
	color: ColorName = 'reset',
	isBold: boolean = false): string => {
	
	const colorCode = colors[ color ];
	const bold = isBold ? colors.bold : '';
	const item = `${ bold }${ colorCode }${ msg }${ colors.reset }`;
	return item;
};
// _______________________________________________

// noinspection JSUnusedGlobalSymbols
export const spacer = (msg: string, spaceCount: number = 0) => {
	const spacer = '-'.repeat(spaceCount);
	
	const msgResult = `
    ${ spacer }\n
  \t${ msg }\n
    ${ spacer }`;
	
	const item = withColorLogger(msgResult, "dodgerBlue", true);
	return item;
};
// _______________________________________________