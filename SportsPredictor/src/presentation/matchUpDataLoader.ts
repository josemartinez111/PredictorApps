// FILE: presentation/matchUpDataLoader.ts
// _______________________________________________

import { GameDataInputPrompt, TeamData } from "../domain/dataEntities";
import { MatchFullStatsParams } from "../domain/types/typeHelpers";
import { toNumber } from "../infrastructure/utils";
import { Color, withColorLogger, withConsoleColorLogger } from "./custom-loggers/colorLogger";
import { promptForTeamData, promptQuestion } from "./custom-loggers/game-prompt-logger";

// _______________________________________________

export function MatchUpStatsManually(loader: MatchFullStatsParams): {
	team1Data: TeamData;
	team2Data: TeamData;
	gameDataInput: GameDataInputPrompt
} {
	
	const gameDataInput: GameDataInputPrompt = {
		sport: "Baseball",
		overUnderLine: 8.5,
		spread: 1.5,
		homeTeam: "TOR",
		favoredTeam: "TOR",
	};
	
	const awayTeam = "KC"
	
	const awayTeamData: TeamData = loader.createTeamData(
		awayTeam,
		/** Scored (RF): */ 459,
		/** Allowed (RA): */ 310,
		/** Elo (Pitcher Throw Hand): */ 232,
		/** Head to Head Wins: */ 3,
		/** Head to Head Losses: */ 7,
		/** Home Wins: */ 12,
		/** Home Losses: */ 5,
		/** Away Wins: */ 5,
		/** Away Losses: */ 7,
		162,
	);
	
	// Example team data, ideally loaded from a database or external source
	const homeTeamData: TeamData = loader.createTeamData(
		<string>gameDataInput.homeTeam,
		/** Scored (RF): */ 355,
		/** Allowed (RA): */ 438,
		/** Elo (Pitcher Throw Hand): */ 217,
		/** Head to Head Wins: */ 7,
		/** Head to Head Losses: */ 3,
		/** Home Wins: */ 7,
		/** Home Losses: */ 5,
		/** Away Wins: */ 7,
		/** Away Losses: */ 10,
		162,
	);
	
	return { team1Data: homeTeamData, team2Data: awayTeamData, gameDataInput };
}

// _____________________________________________________________________

export async function MatchUpStatsUserInput(loader: MatchFullStatsParams): Promise<{
	team1Data: TeamData;
	team2Data: TeamData;
	gameDataInput: GameDataInputPrompt
}> {
	// Collect Team 1 Data
	withConsoleColorLogger("Please enter Team 1 data:", Color.DodgerBlue, true);
	const team1Data = await promptForTeamData(
		loader,
		withColorLogger("Team 1", Color.DodgerBlue, true),
	);
	
	// Collect Team 2 Data
	console.log("\nPlease enter Team 2 data:");
	const team2Data = await promptForTeamData(
		loader,
		withColorLogger("Team 2", Color.DodgerBlue, true),
	);
	
	// Determine Home and Away Teams based on User Input
	const homeTeamName = await promptQuestion(
		withColorLogger(
			"Enter the Home Team Name (exact name as entered): ",
			Color.DodgerBlue,
			true,
		),
	);
	const awayTeamName = await promptQuestion(withColorLogger(
			"Enter the Away Team Name (exact name as entered): ",
			Color.DodgerBlue,
			true,
		),
	);
	
	// Validate Home and Away Team Names
	const homeTeam = homeTeamName === team1Data.name ? team1Data : team2Data;
	const awayTeam = awayTeamName === team2Data.name ? team2Data : team1Data;
	
	// Collecting Game Data Input
	withConsoleColorLogger("\nPlease enter Game Data:", Color.DodgerBlue, true);
	const sport = await promptQuestion(withColorLogger("Sport: ", Color.DodgerBlue, true));
	
	const overUnderLine = toNumber(
		await promptQuestion(
			withColorLogger("Over/Under Line: ", Color.DodgerBlue, true),
		));
	
	const spread = toNumber(
		await promptQuestion(
			withColorLogger("Spread: ", Color.DodgerBlue, true),
		));
	
	const favoredTeam = await promptQuestion(
		withColorLogger(
			"Favored Team Name (exact name as entered): ",
			Color.DodgerBlue,
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






















