// FILE: infrastructure/utils.ts
// _______________________________________________

import { withConsoleColorLogger } from "./colorLogger";
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
// _______________________________________________