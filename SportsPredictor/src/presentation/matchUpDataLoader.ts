// FILE: presentation/matchUpDataLoader.ts
// _______________________________________________

import { GameDataInputPrompt, TeamData } from "../domain/dataEntities";
import { MatchFullStatsParams } from "../domain/types/typeHelpers";
import { toNumber } from "../infrastructure/utils";
import { withColorLogger, withConsoleColorLogger } from "./custom-loggers/colorLogger";
import { promptForTeamData, promptQuestion } from "./custom-loggers/game-prompt-logger";

// _______________________________________________

export function MatchUpStatsManually(loader: MatchFullStatsParams): {
	team1Data: TeamData;
	team2Data: TeamData;
	gameDataInput: GameDataInputPrompt
} {
	// Example team data, ideally loaded from a database or external source
	const team1Data: TeamData = loader.createTeamData(
		"BOS",
		/** Scored (RF): */ 522,
		/** Allowed (RA): */ 356,
		/** Elo (Pitcher Throw Hand): */ 630,
		/** Head to Head Wins: */ 6,
		/** Head to Head Losses: */ 4,
		/** Home Wins: */ 4,
		/** Home Losses: */ 2,
		/** Away Wins: */ 7,
		/** Away Losses: */ 3,
		162,
	);
	
	const team2Data: TeamData = loader.createTeamData(
		"BAL",
		/** Scored (RF): */ 500,
		/** Allowed (RA): */ 240,
		/** Elo (Pitcher Throw Hand): */ 245,
		/** Head to Head Wins: */ 4,
		/** Head to Head Losses: */ 6,
		/** Home Wins: */ 0,
		/** Home Losses: */ 0,
		/** Away Wins: */ 7,
		/** Away Losses: */ 3,
		162,
	);
	
	const gameDataInput: GameDataInputPrompt = {
		sport: "Baseball",
		overUnderLine: 8.5,
		spread: 1.5,
		homeTeam: "BOS",
		favoredTeam: "BAL",
	};
	return { team1Data, team2Data, gameDataInput };
}

// _____________________________________________________________________

export async function MatchUpStatsUserInput(loader: MatchFullStatsParams): Promise<{
	team1Data: TeamData;
	team2Data: TeamData;
	gameDataInput: GameDataInputPrompt
}> {
	// Collect Team 1 Data
	withConsoleColorLogger("Please enter Team 1 data:", "dodgerBlue", true);
	const team1Data = await promptForTeamData(
		loader,
		withColorLogger("Team 1", "dodgerBlue", true),
	);
	
	// Collect Team 2 Data
	console.log("\nPlease enter Team 2 data:");
	const team2Data = await promptForTeamData(
		loader,
		withColorLogger("Team 2", "dodgerBlue", true),
	);
	
	// Determine Home and Away Teams based on User Input
	const homeTeamName = await promptQuestion(
		withColorLogger(
			"Enter the Home Team Name (exact name as entered): ",
			"dodgerBlue",
			true,
		),
	);
	const awayTeamName = await promptQuestion(withColorLogger(
			"Enter the Away Team Name (exact name as entered): ",
			"dodgerBlue",
			true,
		),
	);
	
	// Validate Home and Away Team Names
	const homeTeam = homeTeamName === team1Data.name ? team1Data : team2Data;
	const awayTeam = awayTeamName === team2Data.name ? team2Data : team1Data;
	
	// Collecting Game Data Input
	withConsoleColorLogger("\nPlease enter Game Data:", "dodgerBlue", true);
	const sport = await promptQuestion(withColorLogger("Sport: ", "dodgerBlue", true));
	
	const overUnderLine = toNumber(
		await promptQuestion(
			withColorLogger("Over/Under Line: ", "dodgerBlue", true),
		));
	
	const spread = toNumber(
		await promptQuestion(
			withColorLogger("Spread: ", "dodgerBlue", true),
		));
	
	const favoredTeam = await promptQuestion(
		withColorLogger(
			"Favored Team Name (exact name as entered): ",
			"dodgerBlue",
			true,
		),
	);
	
	const gameDataInput: GameDataInputPrompt = {
		sport,
		overUnderLine,
		spread,
		homeTeam: homeTeam.name,
		favoredTeam,
	};
	
	console.log("\nSummary of the entered data:");
	console.log("Home Team Data:", homeTeam);
	console.log("Away Team Data:", awayTeam);
	console.log("Game Data:", gameDataInput);
	
	// Do not close the readline interface here if you need it to remain open for future operations
	// readInput.close();
	
	return { team1Data: homeTeam, team2Data: awayTeam, gameDataInput };
}


// _____________________________________________________________________






















