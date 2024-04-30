// FILE: custom-loggers/game-prompt-logger.ts
// _____________________________________________________________________

import * as readline from "node:readline";
import { TeamData } from "../../domain/dataEntities";
import { MatchFullStatsParams } from "../../domain/types/typeHelpers";
import { toNumber } from "../../infrastructure/utils";
import { Color, withColorLogger } from "./colorLogger";
// _____________________________________________________________________

// _____________________________________________________________________

export const readInput = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

export const promptQuestion = (query: string): Promise<string> => {
	return new Promise((resolve) => {
		readInput.question(query, (answer) => {
			resolve(answer);
		});
	});
};

// _____________________________________________________________________

export async function promptForTeamData(loader: MatchFullStatsParams, teamLabel: string): Promise<TeamData> {
	const name = await promptQuestion(withColorLogger(`${teamLabel} Name: `,  Color.DodgerBlue, true));
	const scored = toNumber(await promptQuestion(withColorLogger(`${teamLabel} Scored (RF): `,  Color.DodgerBlue, true)));
	const allowed = toNumber(await promptQuestion(withColorLogger(`${teamLabel} Allowed (RA): `,  Color.DodgerBlue, true)));
	
	const elo = toNumber(await promptQuestion(withColorLogger(`${teamLabel} Elo (Pitcher Throw Hand): `)));
	const headToHeadWins = toNumber(await promptQuestion(withColorLogger(`${teamLabel} Head to Head Wins: `,  Color.DodgerBlue, true)));
	const headToHeadLosses = toNumber(await promptQuestion(withColorLogger(`${teamLabel} Head to Head Losses: `,  Color.DodgerBlue, true)));
	
	const homeWins = toNumber(await promptQuestion(withColorLogger(`${teamLabel} Home Wins: `,  Color.DodgerBlue, true)));
	const homeLosses = toNumber(await promptQuestion(withColorLogger(`${teamLabel} Home Losses: `,  Color.DodgerBlue, true)));
	const awayWins = toNumber(await promptQuestion(withColorLogger(`${teamLabel} Away Wins: `,  Color.DodgerBlue, true)));
	
	const awayLosses = toNumber(await promptQuestion(withColorLogger(`${teamLabel} Away Losses: `,  Color.DodgerBlue, true)));
	const totalGamesPlayed = toNumber(await promptQuestion(withColorLogger(`${teamLabel} Total Games Played: `,  Color.DodgerBlue, true)));
	
	// Use the loader's createTeamData function as intended to create and return a TeamData object.
	return loader.createTeamData(
		name, scored, allowed, elo,
		headToHeadWins, headToHeadLosses,
		homeWins, homeLosses,
		awayWins, awayLosses,
		totalGamesPlayed
	);
}
// _____________________________________________________________________