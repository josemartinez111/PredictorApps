// FILE: application/calculations.ts
// _______________________________________________

import { GameData, TeamData } from "../domain/dataEntities";
import { EloChangeType } from "../domain/types/typeHelpers";
// _______________________________________________

// Function to calculate the standard deviation of team performance metrics.
// Assumes that all necessary team metrics are provided and correctly populated
// by the calling context or earlier in the codebase.
const calculateSTDDevFactor = (team: TeamData): number => {
	// Using provided metrics as data points for the standard deviation calculation.
	// This function now expects that all necessary data points are populated and passed to it,
	// eliminating the need for default values within the function itself.
	const data = [
		team.scored / (team.totalGamesPlayed ?? 1),
		team.allowed / (team.totalGamesPlayed ?? 1),
		((team.headToHeadWins ?? 1) - (team.headToHeadLosses ?? 1)) / (team.totalGamesPlayed ?? 1),
		((team.homeWins ?? 1) - (team.homeLosses ?? 1)) / (team.totalGamesPlayed ?? 1),
		((team.awayWins ?? 1) - (team.awayLosses ?? 1)) / (team.totalGamesPlayed ?? 1),
	].filter((n: number) => (
		!isNaN(n)
	)); // Filter out NaN values in case of missing data points to ensure calculation accuracy.
	
	// Calculate the mean of the data points
	const mean = data.reduce((sum: number, value: number) => sum + value, 0) / data.length;
	
	// Calculate the variance
	const variance = data.reduce((sum: number, value: number) => (
		sum + Math.pow(value - mean, 2)
	), 0) / (data.length - 1);
	
	// Return the square root of the variance (standard deviation)
	const sqRootResult = Math.sqrt(variance);
	return sqRootResult;
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

export const calcExpectedEloChange = (
	team1: TeamData,
	team2: TeamData,
	matchData: GameData): EloChangeType => {
	const { elo: team1Elo = 1200 } = team1;
	const { elo: team2Elo = 1200 } = team2;
	const kFactor = matchData.kFactor || 20;
	
	const homeAdvantage = matchData.homeTeam === team1.name ? 100 : 0;
	const adjustedTeam1Elo = team1Elo + homeAdvantage;
	
	// Calculate expected win chance without actualOutcome
	const expectedWin1 = 1.0 / (1.0 + 10.0 ** ((team2Elo - adjustedTeam1Elo) / 400.0));
	const expectedWin2 = 1 - expectedWin1;
	
	// Estimate expected Elo change based on the chance of winning
	const expectedEloChange1 = kFactor * (expectedWin1 - 0.5); // Assuming a neutral-expected outcome of 0.5 for calculation
	const expectedEloChange2 = kFactor * (expectedWin2 - 0.5);
	
	return { expectedEloChange1, expectedEloChange2 };
};
// ____________________________________________________________________

export const calcRegressionFactor = (team1: TeamData, team2: TeamData): number => {
	// Dynamic alpha adjustment based on season stage or performance variance
	const seasonProgress = Math.min(team1.totalGamesPlayed ?? 0, team2.totalGamesPlayed ?? 0) / 162;
	const alpha = Math.max(0.3, 1 - seasonProgress); // Later in the season, reduce alpha
	
	// Normalize total games played to avoid division by zero
	const totalGames1 = Math.max(team1.totalGamesPlayed ?? 1, 1);
	const totalGames2 = Math.max(team2.totalGamesPlayed ?? 1, 1);
	
	// Exponential smoothing with dynamic alpha
	const smoothedScored1 = (team1.scored / totalGames1) * alpha + (1 - alpha);
	const smoothedAllowed1 = (team1.allowed / totalGames1) * alpha + (1 - alpha);
	const smoothedScored2 = (team2.scored / totalGames2) * alpha + (1 - alpha);
	const smoothedAllowed2 = (team2.allowed / totalGames2) * alpha + (1 - alpha);
	
	// Enhanced trend score calculation with considerations for strength of schedule and variance
	const trendScore1 = (smoothedScored1 - smoothedAllowed1) * Math.log(1 + team1.elo);
	const trendScore2 = (smoothedScored2 - smoothedAllowed2) * Math.log(1 + team2.elo);
	
	// Consideration for combined performance trend with dynamic adjustments
	const combinedTrendScore = (trendScore1 + trendScore2) / 2; // Average trend score for simplicity
	
	// Adjustment factor based on combined trend scores with safety bounds
	const adjustmentFactor = 1 + (combinedTrendScore / 100); // Normalize trend impact
	const adjustedFactorSafeBound = Math.max(0.9, Math.min(1.1, adjustmentFactor));
	
	// Return the safely bounded adjustment factor
	return adjustedFactorSafeBound;
};
// ____________________________________________________________________
