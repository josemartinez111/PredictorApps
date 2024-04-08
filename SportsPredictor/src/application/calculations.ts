// FILE: application/calculations.ts
// _______________________________________________

import { TeamData } from "../domain/dataEntities";

// Function to approximate a variability factor based on team performance metrics.
// This serves as a proxy for standard deviation in this context.
const calculateSTDDevFactor = (team: TeamData): number => {
	const {
		scored,
		allowed,
		totalGamesPlayed = 1,
	} = team;
	const averageScore = scored / totalGamesPlayed;
	const averageAllowed = allowed / totalGamesPlayed;
	// Variability factor approximates the standard deviation
	// proxy based on the difference between scored and allowed.
	return Math.abs(averageScore - averageAllowed) / Math.sqrt(totalGamesPlayed);
};
// ___________________________________________________________________

export const calcWinPctPythagorean = (team: TeamData): number => {
	const {
		scored,
		allowed,
	} = team;
	const variabilityFactor = calculateSTDDevFactor(team);
	// Adjust Pythagorean win percentage calculation with the variability factor.
	const pythagoreanWinPercentage = (scored ** 2 / (scored ** 2 + allowed ** 2)) * (1 + variabilityFactor);
	return pythagoreanWinPercentage;
};
// ___________________________________________________________________

export const calcEloRating = (team1: TeamData, team2: TeamData, kFactor: number): number => {
	const { elo: team1Elo = 1200 } = team1;
	const { elo: team2Elo = 1200 } = team2;
	const expectedWin = 1.0 / (1.0 + 10.0 ** ((team2Elo - team1Elo) / 400.0));
	// Incorporating variability factors to adjust the Elo rating calculation.
	const variabilityFactor1 = calculateSTDDevFactor(team1);
	const variabilityFactor2 = calculateSTDDevFactor(team2);
	const adjustedKFactor = kFactor * (1 + (variabilityFactor1 - variabilityFactor2) / 2);
	return team1Elo + adjustedKFactor * (1.0 - expectedWin); // Assuming a win.
};
// ___________________________________________________________________

export const calcSpreadFactor = (team: TeamData, spread: number): number => {
	const variabilityFactor = calculateSTDDevFactor(team);
	// Use a variability factor to adjust the spread factor calculation.
	return 1 + variabilityFactor * spread - calcWinPctPythagorean(team) / 7;
};
// ____________________________________________________________________
export const calcRegressionFactor = (team1: TeamData, team2: TeamData): number => {
	// Define a smoothing factor for exponential smoothing - this could be adjusted based on model tuning
	const alpha = 0.5;
	const totalGamesInSeason = 162;
	
	// Ensure total games played are accounted for to avoid division by zero
	const totalGames1 = Math.max(team1.totalGamesPlayed ?? 1, 1);
	const totalGames2 = Math.max(team2.totalGamesPlayed ?? 1, 1);
	
	// Exponential smoothing applied directly within calculation
	const smoothedScored1 = team1.scored / totalGames1 * alpha + (1 - alpha);
	const smoothedAllowed1 = team1.allowed / totalGames1 * alpha + (1 - alpha);
	const smoothedScored2 = team2.scored / totalGames2 * alpha + (1 - alpha);
	const smoothedAllowed2 = team2.allowed / totalGames2 * alpha + (1 - alpha);
	
	// Direct trend identification from smoothed scores
	const trendScore1 = smoothedScored1 - smoothedAllowed1;
	const trendScore2 = smoothedScored2 - smoothedAllowed2;
	
	// Combined performance trend score calculation
	const combinedTrendScore = (trendScore1 + trendScore2) / totalGamesInSeason;
	
	// Adjustment factor based on combined trend scores, ensuring it remains within realistic bounds,
	// This factor aims to simulate deeper analytical adjustments akin to regression analysis
	const adjustmentFactor = alpha + combinedTrendScore;
	const adjustedFactorSafeBound = Math.max(0.9, Math.min(1.1, adjustmentFactor));
	
	// Return the safely bounded adjustment factor
	return adjustedFactorSafeBound;
};
// ____________________________________________________________________
