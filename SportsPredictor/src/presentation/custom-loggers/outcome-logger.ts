// FILE: presentation/custom-loggers/outcome-logger.ts
// _______________________________________________

import { GameData } from "../../domain/dataEntities";
import { spacer } from "../../domain/types/typeHelpers";
import { withConsoleColorLogger } from "./colorLogger";
// _______________________________________________

export const outcomeLogger = (
	data: GameData,
	winProbability1: number,
	winProbability2: number,
	outcomeMessage: string): void => {
	// Logging structure
	withConsoleColorLogger(spacer, "dodgerBlue", true);
	withConsoleColorLogger(
		`Teams: ${ data.team1.name } vs ${ data.team2.name }`,
		"netflixRed", true,
	);
	
	if (data.homeTeam === data.team1.name) {
		withConsoleColorLogger(
			`Home Team: ${ data.team1.name }`,
			"netflixRed",
			true,
		);
	} else if (data.homeTeam === data.team2.name) {
		withConsoleColorLogger(
			`Home Team: ${ data.team2.name }`,
			"netflixRed",
			true,
		);
	}
	withConsoleColorLogger(spacer, "dodgerBlue", true);
	
	if (data.spread) {
		withConsoleColorLogger(`Spread: ${ data.spread }`, "cyan", true);
	}
	
	const msgTeam1 = `Team 1 (${ data.team1.name }) Win Probability: ${ (winProbability1 * 100).toFixed(2) }%`;
	withConsoleColorLogger(msgTeam1, "cyan", true);
	
	const msgTeam2 = `Team 2 (${ data.team2.name }) Win Probability: ${ (winProbability2 * 100).toFixed(2) }%`;
	withConsoleColorLogger(msgTeam2, "cyan", true);
	
	const isColor = winProbability1 === winProbability2
		? "netflixRed"
		: winProbability1 > winProbability2
			? "netflixRed"
			: "cyan";
	
	withConsoleColorLogger(outcomeMessage, isColor, true);
	withConsoleColorLogger(spacer, "dodgerBlue", true);
};
// ___________________________________________________________________