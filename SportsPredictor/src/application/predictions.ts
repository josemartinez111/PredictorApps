// ---------------------------------------------------------
//               application/predictions.ts
// ---------------------------------------------------------

import { GameData, TeamData } from "../domain/dataEntities";
import { withColorLogger } from "../presentation/custom-loggers/colorLogger";
import { outcomeLogger } from "../presentation/custom-loggers/outcome-logger";
import { overUnderLogger } from "../presentation/custom-loggers/over-under-logger";
import {
	calcWinPctPythagorean, calcRegressionFactor, calcExpectedEloChange,
} from "./calculations";
// _______________________________________________

export const predictOutcome = (data: GameData): string => {
	// Use current Elo ratings directly from team data, as we're predicting outcomes before the game
	// Note: Elo ratings are now dynamically adjusted within the prediction process
	const { expectedEloChange1, expectedEloChange2 } = calcExpectedEloChange(
		data.team1,
		data.team2,
		data,
	);

	// Calculate advanced metrics for both teams
	const pythagoreanWinPercentage1 = calcWinPctPythagorean(data.team1);
	const pythagoreanWinPercentage2 = calcWinPctPythagorean(data.team2);

	// Advanced spread factor calculation
	const spreadFactor1 = calcAdvancedSpreadFactor(data, data.team1);
	const spreadFactor2 = calcAdvancedSpreadFactor(data, data.team2);

	// Singular regression factor calculation for efficiency
	const regressionFactor = calcRegressionFactor(data.team1, data.team2);

	// Introduce dynamic weighting based on the stage of the season or other factors
	// Elo ratings are adjusted based on the expected change derived from calcExpectedEloChange
	const weightedWinProb1 = dynamicWeighting(
		pythagoreanWinPercentage1,
		data.team1.elo + expectedEloChange1, // Dynamically adjust Elo rating based on expected change
		spreadFactor1,
		regressionFactor,
		data,
	);

	const weightedWinProb2 = dynamicWeighting(
		pythagoreanWinPercentage2,
		data.team2.elo + expectedEloChange2, // Dynamically adjust Elo rating based on expected change
		spreadFactor2,
		regressionFactor,
		data,
	);

	// Normalize win probabilities
	const totalWeightedProbability = weightedWinProb1 + weightedWinProb2;
	const normalizedWinProb1 = weightedWinProb1 / totalWeightedProbability;
	const normalizedWinProb2 = weightedWinProb2 / totalWeightedProbability;

	// Determine expected winner with an adaptive close game threshold
	const outcomeMessage = determineOutcome(
		data,
		normalizedWinProb1,
		normalizedWinProb2,
	);

	// Log the outcome
	outcomeLogger(
		data,
		normalizedWinProb1,
		normalizedWinProb2,
		outcomeMessage,
	);

	return outcomeMessage;
};
// ____________________________________________________________________

export const predictOverUnder = (data: GameData): string => {
	const totalScored = data.team1.scored + data.team2.scored;
	const totalAllowed = data.team1.allowed + data.team2.allowed;
	const totalGamesPlayed = (data.team1.totalGamesPlayed || 0) + (data.team2.totalGamesPlayed || 0);
	
	if (totalGamesPlayed !== 0) {
		const combinedAverageScore = (totalScored + totalAllowed) / totalGamesPlayed;
		const regAdjustmentFactor = calcRegressionFactor(data.team1, data.team2);
		const eloDiff = Math.abs(data.team1.elo - data.team2.elo);
		const eloAdjustment = 1 / (1 + Math.exp(eloDiff / 400));
		const headToHeadWins = (data.team1.headToHeadWins || 0) - (data.team2.headToHeadWins || 0);
		const headToHeadAdjustment = headToHeadWins / totalGamesPlayed;
		const adjustedAverageScore = (combinedAverageScore * regAdjustmentFactor) + eloAdjustment + headToHeadAdjustment - 1.5;
		overUnderLogger(data, adjustedAverageScore);
		const predictionResult = adjustedAverageScore > (data.overUnderLine ?? 8)
			? "Over\n"
			: "Under\n";
		
		return predictionResult;
	}
	
	return "Data Insufficient for Prediction\n";
};

// ____________________________________________________________________

function dynamicWeighting(
	pythagWinPct: number,
	eloRating: number,
	spreadFactor: number,
	regressionFactor: number,
	matchData: GameData): number {
	// Calculate the progression of the season to adjust weights dynamically
	const seasonProgress = Math.min(
		matchData.team1.totalGamesPlayed ?? 0,
		matchData.team2.totalGamesPlayed ?? 0) / (matchData.sport === 'Baseball' ? 162 : 38
	); // Example for MLB or Premier League
	
	// Adjust how much each factor weighs based on the season progress
	const eloWeight = 0.5 + (0.5 - seasonProgress); // Elo rating becomes less dominant as the season progresses
	const pythagWeight = 0.5 * seasonProgress; // Pythagorean win percentage gains more weight as the season progresses
	
	// The spread factor and regression factor's influence remain constant throughout the season in this model
	// These could also be adjusted dynamically based on season progress or other factors if desired
	const weightedPythag = pythagWinPct * pythagWeight;
	const weightedElo = (eloRating / 4000) * eloWeight; // Simplifying an assumption for Elo adjustment
	
	// Composite score calculation considering dynamic weights
	const compositeScore = weightedPythag + weightedElo + spreadFactor * 0.1 + regressionFactor * 0.1;
	return compositeScore;
}

// ____________________________________________________________________

function determineOutcome(data: GameData, winProb1: number, winProb2: number): string {
	const CLOSE_GAME_THRESHOLD = 0.0175; // Placeholder for adaptive logic
	const absoluteDiff = Math.abs(winProb1 - winProb2);
	if (absoluteDiff <= CLOSE_GAME_THRESHOLD) {
		return withColorLogger("[ THE GAME COULD GO EITHER WAY ]", "netflixRed", true);
	}
	return winProb1 > winProb2
		? withColorLogger(`Expected winner: ${ data.team1.name }`, "cyan", true)
		: withColorLogger(`Expected winner: ${ data.team2.name }`, "cyan", true);
}

// ____________________________________________________________________

function calcAdvancedSpreadFactor(data: GameData, team: TeamData): number {
	const BASE_SPREAD_FACTOR = 1; // Default factor when spread data is unavailable
	if (!data.spread || data.favoredTeam !== team.name) {
		return BASE_SPREAD_FACTOR;
	}
	// Placeholder for actual calculation logic, which could involve historical data analysis,
	// For example, a team's performance against the spread in past games
	const spreadPerformanceAdjustment = 0.05; // This could be dynamically calculated
	return BASE_SPREAD_FACTOR + spreadPerformanceAdjustment;
}

// ____________________________________________________________________















