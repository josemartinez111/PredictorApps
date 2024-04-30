// FILE: presentation/gameDataLoader.ts
// _______________________________________________

import { predictOutcome, predictOverUnder } from "../application/predictions";
import { GameData, TeamData } from "../domain/dataEntities";
import {
	ChooseGameTypeParams,
	ChooseGameTypeReturn,
	DataInputLogic,
	GameDataInputType,
	LoaderLogic,
} from "../domain/types/typeHelpers";
import { roundHelper, scoredAndAllowedAdjuster } from "../infrastructure/utils";
import { Color, withConsoleColorLogger } from "./custom-loggers/colorLogger";
import { readInput } from "./custom-loggers/game-prompt-logger";
import { MatchUpStatsManually, MatchUpStatsUserInput } from "./matchUpDataLoader";

// _______________________________________________

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
	withConsoleColorLogger(headerMsg, Color.DodgerBlue, true);
	
	predictOutcome(gameData);
	const overUnderPrediction = predictOverUnder(gameData);
	
	withConsoleColorLogger(
		`Over/Under prediction: ${ overUnderPrediction }`,
		Color.HotPink,
		true,
	);
	
	readInput.close();
}

// ___________________________________________________________________

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
		
		const {
			sport,
			overUnderLine,
			spread,
			homeTeam,
			favoredTeam,
		} = gameDataInput; // Default kFactor to 30 if not supplied
		
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

export async function chooseGameType({
	whichGameType, loader,
}: ChooseGameTypeParams): Promise<ChooseGameTypeReturn> {
	
	switch (whichGameType) {
		case "input":
			const item = await MatchUpStatsUserInput(loader);
			// Direct return from the function if the structure matches ChooseGameTypeReturn
			return {
				team1Data: item.team1Data,
				team2Data: item.team2Data,
				gameDataInput: item.gameDataInput, // Ensure MatchUpStatsUserInput returns this
			};
		case "manual":
			const response = MatchUpStatsManually(loader);
			// Adjust MatchUpStatsManually or its handling here to ensure compatibility
			return {
				team1Data: response.team1Data,
				team2Data: response.team2Data,
				gameDataInput: response.gameDataInput, // Ensure MatchUpStatsManually returns this
			};
		default:
			// Fallback or error handling for invalid game type
			throw new Error("Invalid game type specified");
	}
}

// ___________________________________________________________________