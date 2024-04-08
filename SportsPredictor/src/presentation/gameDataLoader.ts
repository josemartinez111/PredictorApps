// FILE: presentation/gameDataLoader.ts
// _______________________________________________

import { predictOutcome, predictOverUnder } from "../application/predictions";
import { GameData, TeamData } from "../domain/dataEntities";
import { DataInputLogic, GameDataInputType, LoaderLogic } from "../domain/types/typeHelpers";
import { roundHelper, scoredAndAllowedAdjuster } from "../infrastructure/utils";
import { withConsoleColorLogger } from "./custom-loggers/colorLogger";

// _______________________________________________

export function GameDataLoader() {
	// Utility method for creating team data
	const createTeamData = (
		name: string,
		scored: number,
		allowed: number,
		elo: number,
		headToHeadWins: number,
		headToHeadLosses: number,
		homeWins: number,
		homeLosses: number,
		awayWins: number,
		awayLosses: number,
		totalGamesPlayed: number): TeamData => {
		
		return {
			name,
			scored: scoredAndAllowedAdjuster(scored),
			allowed: scoredAndAllowedAdjuster(allowed),
			elo,
			headToHeadWins,
			headToHeadLosses,
			homeWins,
			homeLosses,
			awayWins,
			awayLosses,
			totalGamesPlayed,
		};
	};
	
	/**
	 *
	 * @param {TeamData} team1Data
	 * @param {TeamData} team2Data
	 * @param {GameDataInputType} gameDataInput
	 * @return {GameData}
	 */
	const loadGameData = (
		team1Data: TeamData,
		team2Data: TeamData,
		gameDataInput: GameDataInputType): GameData => {
		const { sport, overUnderLine, spread, homeTeam, favoredTeam } = gameDataInput; // Default kFactor to 30 if not supplied
		
		// Validate inputs (example)
		if (overUnderLine <= 0) throw new Error("OverUnderLine must be positive");
		
		return {
			team1: team1Data,
			team2: team2Data,
			sport,
			kFactor: roundHelper(team1Data.elo / team2Data.elo),
			overUnderLine,
			spread,
			homeTeam,
			favoredTeam,
		};
	};
	
	
	return {
		createTeamData,
		loadGameData,
	};
}

// ___________________________________________________________________

export function runApp(
	loader: LoaderLogic,
	team1Data: TeamData,
	team2Data: TeamData,
	gameDataInput: DataInputLogic) {
	
	const gameData = loader.loadGameData(
		team1Data,
		team2Data,
		gameDataInput,
	);
	
	const headerMsg = `=================== [ ${ gameData.sport } ] ====================`;
	withConsoleColorLogger(headerMsg, "dodgerBlue", true);
	
	predictOutcome(gameData);
	const overUnderPrediction = predictOverUnder(gameData);
	
	withConsoleColorLogger(
		`Over/Under prediction: ${ overUnderPrediction }`,
		"cyan",
		true,
	);
};
// ___________________________________________________________________