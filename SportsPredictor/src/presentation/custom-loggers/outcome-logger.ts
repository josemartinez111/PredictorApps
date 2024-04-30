// FILE: presentation/custom-loggers/outcome-logger.ts
// _______________________________________________

import { GameData } from "../../domain/dataEntities";
import { spacer } from "../../domain/types/typeHelpers";
import { Color, spacerH1, withConsoleColorLogger } from "./colorLogger";
// _______________________________________________

export const outcomeLogger = (
	data: GameData,
	winProbability1: number,
	winProbability2: number,
	outcomeMessage: string): void => {
	
	// Logging structure
	withConsoleColorLogger(spacer, Color.DodgerBlue, true);
	const spacerLine = spacerH1("-", 33, Color.White);
	
	withConsoleColorLogger(
		`\nTeams: ${ data.team2.name } vs ${ data.team1.name }`,
		Color.BrightYellow, true,
	);
	
	console.log(spacerLine);
	
	
	if (data.homeTeam === data.team1.name) {
		withConsoleColorLogger(
			`\nHome Team: ${ data.team1.name }`,
			Color.Magenta,
			true,
		);
		
		console.log(spacerLine);
	} else if (data.homeTeam === data.team2.name) {
		withConsoleColorLogger(
			`\nHome Team: ${ data.team2.name }\n`,
			Color.NetflixRed,
			true,
		);
		
		console.log(spacerLine);
	}
	
	withConsoleColorLogger(
		`\n(-) Favored Team: ${ data.favoredTeam }`,
		Color.HotPink,
		true,
	);
	
	console.log(spacerLine);
	withConsoleColorLogger(spacer, Color.DodgerBlue, true);
	
	if (data.spread) {
		withConsoleColorLogger(`Spread: ${ data.spread }`, Color.Red, true);
	}
	
	const msgTeam2 = `AWAY TEAM (${ data.team2.name }) Win Probability: ${
		(winProbability2 * 100).toFixed(2)
	}%`;
	withConsoleColorLogger(msgTeam2, Color.Cyan, true);
	
	const msgTeam1 = `HOME TEAM (${ data.team1.name }) Win Probability: ${
		(winProbability1 * 100).toFixed(2)
	}%`;
	withConsoleColorLogger(msgTeam1, Color.Cyan, true);
	
	const isColor = winProbability1 === winProbability2
		? Color.NetflixRed
		: winProbability1 > winProbability2
			? Color.NetflixRed
			: Color.Cyan;
	
	withConsoleColorLogger(outcomeMessage, isColor, true);
	withConsoleColorLogger(spacer, Color.DodgerBlue, true);
};
// ___________________________________________________________________