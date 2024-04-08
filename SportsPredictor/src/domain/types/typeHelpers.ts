// FILE: domain/types/typeHelpers.ts
// _______________________________________________

import { spacerH1 } from "../../presentation/custom-loggers/colorLogger";
import { GameData, TeamData } from "../dataEntities";
// _______________________________________________

export const spacer = spacerH1(
	"_",
	55,
	"dodgerBlue"
);
// ___________________________________________________________________

export type GameDataInputType = {
	sport: string,
	kFactor?: number, // Optional and provide a default if not supplied
	overUnderLine: number,
	spread: number,
	homeTeam: string,
	favoredTeam: string,
}
// ___________________________________________________________________

export type MatchFullStatsParams = {
	createTeamData: (
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
		totalGamesPlayed: number) => TeamData;
	
	loadGameData: (
		team1Data: TeamData,
		team2Data: TeamData,
		gameDataInput: GameDataInputType) => GameData;
}
// ___________________________________________________________________

export interface LoaderLogic {
	createTeamData: (
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
		totalGamesPlayed: number) => TeamData;
	
	loadGameData: (
		team1Data: TeamData,
		team2Data: TeamData,
		gameDataInput: GameDataInputType) => GameData;
}
// ___________________________________________________________________

export interface DataInputLogic {
	favoredTeam: string;
	overUnderLine: number;
	homeTeam: string;
	sport: string;
	spread: number;
}
// ___________________________________________________________________