// FILE: domain/dataEntities.ts
// _______________________________________________

export interface TeamData {
	name: string;
	scored: number;
	allowed: number;
	elo: number;
	headToHeadWins?: number;
	headToHeadLosses?: number;
	homeWins?: number;
	homeLosses?: number;
	awayWins?: number;
	awayLosses?: number;
	totalGamesPlayed?: number;
}

export interface GameData {
	team1: TeamData;
	team2: TeamData;
	sport: string;
	kFactor?: number;
	overUnderLine?: number;
	spread?: number;
	homeTeam: string;
	favoredTeam: string;
}
// _______________________________________________

export type GameDataInputPrompt = Partial<GameData>;
// _______________________________________________