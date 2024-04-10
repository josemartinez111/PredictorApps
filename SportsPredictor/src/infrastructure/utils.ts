// FILE: infrastructure/utils.ts
// _______________________________________________

import { withConsoleColorLogger } from "../presentation/custom-loggers/colorLogger";
// _______________________________________________

export const roundHelper = (num: number): number => {
	const result = Math.round(num * 100) / 100;
	withConsoleColorLogger(`Elo: ${result}`, "dodgerBlue", true);
	return result;
};
// ____________________________________________________________________

export const scoredAndAllowedAdjuster = (num: number): number => (
	num * 1.5
)
// _____________________________________________________________________

export const toNumber = (input: string): number => {
	return Number(input) || 0;
};
// _____________________________________________________________________