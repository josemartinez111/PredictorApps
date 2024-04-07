// FILE: application/calculations.ts
// _______________________________________________

import { TeamData } from "../domain/dataEntities";
// _______________________________________________

export const calculateWinPercentagePythagorean = (team: TeamData): number => {
	const {
		scored,
		allowed,
		headToHeadWins = 0,
		headToHeadLosses = 0,
		homeWins = 0,
		homeLosses = 0,
		awayWins = 0,
		awayLosses = 0,
	} = team;
	const pythagoreanWinPercentage = scored ** 2 / (scored ** 2 + allowed ** 2);
	const overallWinPercentage =
		(headToHeadWins / (headToHeadWins + headToHeadLosses) +
			homeWins / (homeWins + homeLosses) +
			awayWins / (awayWins + awayLosses)) /
		3;
	return 0.7 * pythagoreanWinPercentage + 0.3 * overallWinPercentage;
};
// ____________________________________________________________________

export const calculateEloRating = (team1: TeamData, team2: TeamData, kFactor: number): number => {
	const { elo: team1Elo = 1200 } = team1;
	const { elo: team2Elo = 1200 } = team2;
	const expectedWin = 1.0 / (1.0 + 10.0 ** ((team2Elo - team1Elo) / 400.0));
	return team1Elo + kFactor * (1.0 - expectedWin); // Assuming a win.
};
// ____________________________________________________________________

export const calculateSpreadFactor = (team: TeamData, spread: number): number => {
	const { homeWins = 0, homeLosses = 0, awayWins = 0, awayLosses = 0 } = team;
	const homeWinPercentage = homeWins / (homeWins + homeLosses);
	const awayWinPercentage = awayWins / (awayWins + awayLosses);
	return 1 + (homeWinPercentage - awayWinPercentage) * spread;
};
// ____________________________________________________________________


















