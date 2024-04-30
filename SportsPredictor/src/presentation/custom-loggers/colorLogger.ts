// FILE: infrastructure/colorLogger.ts
// _______________________________________________

// type ColorName =
// 	'reset' | 'bold' |
// 	'black' | 'red' |
// 	'green' | 'yellow' |
// 	'blue' | 'magenta' |
// 	'cyan' | 'white' |
// 	'dodgerBlue' | 'netflixRed';
//
// // Construct a type with a set of properties K of type T
// const colors: Record<ColorName, string> = {
// 	reset: '\x1b[0m',
// 	bold: '\x1b[1m',
// 	black: '\x1b[30m',
// 	red: '\x1b[31m',
// 	green: '\x1b[32m',
// 	yellow: '\x1b[33m',
// 	blue: '\x1b[34m',
// 	magenta: '\x1b[35m',
// 	cyan: '\x1b[36m',
// 	white: '\x1b[37m',
// 	dodgerBlue: '\x1b[38;2;30;144;255m', // RGB for Dodger Blue
// 	netflixRed: '\x1b[38;2;229;9;20m',  // RGB for Netflix Red
// };

export enum Color {
	// noinspection JSUnusedGlobalSymbols
	Reset = '\x1b[0m',
	Bold = '\x1b[1m',
	Black = '\x1b[30m',
	Red = '\x1b[31m',
	Green = '\x1b[32m',
	Yellow = '\x1b[33m',
	Blue = '\x1b[34m',
	Magenta = '\x1b[35m',
	Cyan = '\x1b[36m',
	White = '\x1b[37m',
	DodgerBlue = '\x1b[38;2;30;144;255m', // RGB for Dodger Blue
	NetflixRed = '\x1b[38;2;229;9;20m',  // RGB for Netflix Red
	DoubleMintGreen = '\x1b[38;2;7;254;111m', // RGB for Double Mint Green
  HotPink = '\x1b[38;2;255;0;158m', // RGB for Hot Pink
	BrightSkyBlue = '\x1b[38;2;3;219;248m', // RGB for Bright Sky Blue
	BrightYellow = '\x1b[38;2;255;255;0m' // RGB for Bright Yellow
}
// _______________________________________________

export const withConsoleColorLogger = (
	msg: string,
	color: Color = Color.Reset,
	isBold: boolean = false): string => {
	
	const colorCode = color;
	const bold = isBold ? Color.Bold : Color.Reset;
	console.log(`${ bold }${ colorCode }${ msg }${ Color.Reset }`);
	
	return msg;
};

export const withColorLogger = (
	msg: string,
	color: Color = Color.Reset,
	isBold: boolean = false): string => {
	
	const colorCode = color;
	const bold = isBold ? Color.Bold : Color.Reset;
	const item = `${ bold }${ colorCode }${ msg }${ Color.Reset }`;
	return item;
};
// _______________________________________________

// noinspection JSUnusedGlobalSymbols
export const spacerWithMsg = (msg: string, spaceCount: number = 0) => {
	const spacer = '-'.repeat(spaceCount);
	
	const msgResult = `
    ${ spacer }\n
  \t${ msg }\n
    ${ spacer }`;
	
	const item = withColorLogger(msgResult, Color.DodgerBlue, true);
	return item;
};

export const spacerH1 = (character: string = "-", spaceCount: number, color: Color) => {
	const spacer = character.repeat(spaceCount);
	const item = withColorLogger(spacer, color, true);
	return item;
};
// _______________________________________________