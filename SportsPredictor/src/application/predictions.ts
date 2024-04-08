// FILE: application/predictions.ts
// _______________________________________________

import { GameData } from "../domain/dataEntities";
import { withColorLogger } from "../presentation/custom-loggers/colorLogger";
import { outcomeLogger } from "../presentation/custom-loggers/outcome-logger";
import { overUnderLogger } from "../presentation/custom-loggers/over-under-logger";
import {
	calcEloRating, calcSpreadFactor, calcWinPctPythagorean, calcRegressionFactor,
} from "./calculations";
// _______________________________________________

export const predictOutcome = (data: GameData): string => {
	// Calculate win probabilities and factors
	const pythagoreanWinPercentage1 = calcWinPctPythagorean(data.team1);
	const pythagoreanWinPercentage2 = calcWinPctPythagorean(data.team2);
	
	const newEloRating1 = calcEloRating(
		data.team1,
		data.team2,
		data.kFactor || 20,
	);
	
	const newEloRating2 = calcEloRating(data.team2,
		data.team1,
		data.kFactor || 20,
	);
	
	const spreadFactor1 = data.spread && data.favoredTeam === data.team1.name
		? calcSpreadFactor(data.team1, data.spread)
		: 1;
	
	const spreadFactor2 = data.spread && data.favoredTeam === data.team2.name
		? calcSpreadFactor(data.team2, data.spread)
		: 1;
	
	let winProbability1 = (pythagoreanWinPercentage1 + newEloRating1 / 2400) / 2;
	winProbability1 *= spreadFactor1 * calcRegressionFactor(data.team1, data.team2);
	let winProbability2 = (pythagoreanWinPercentage2 + newEloRating2 / 2400) / 2;
	winProbability2 *= spreadFactor2 * calcRegressionFactor(data.team1, data.team2);
	
	// Normalize win probabilities
	const totalProbability = winProbability1 + winProbability2;
	winProbability1 /= totalProbability;
	winProbability2 /= totalProbability;
	
	// Determine expected winner
	let outcomeMessage: string;
	// Calculates the absolute difference between the two probabilities
	let absoluteDiff = Math.abs(winProbability1 - winProbability2);
	const eitherWayMsg = "[ THE GAME COULD GO EITHER WAY ]";
	
	outcomeMessage = absoluteDiff <= 0.0175
		? withColorLogger(eitherWayMsg, "netflixRed", true)
		: winProbability1 > winProbability2
			? withColorLogger(`Expected winner: ${ data.team1.name }`, "cyan", true)
			: withColorLogger(`Expected winner: ${ data.team2.name }`, "cyan", true);
	
	outcomeLogger(
		data,
		winProbability1,
		winProbability2,
		outcomeMessage,
	);
	
	// Return the outcome message for further use or display
	return outcomeMessage;
};
// ____________________________________________________________________

export const predictOverUnder = (data: GameData): string => {
	const totalScored = data.team1.scored + data.team2.scored;
	const totalAllowed = data.team1.allowed + data.team2.allowed;
	const totalGamesPlayed = (data.team1.totalGamesPlayed ?? 0) + (data.team2.totalGamesPlayed ?? 0);
	
	// Adjust the average score per game by incorporating the regression factor
	const regAdjustmentFactor = calcRegressionFactor(data.team1, data.team2);
	const averageScorePerGame = (((totalScored + totalAllowed) / totalGamesPlayed) * regAdjustmentFactor) - 1.5;
	
	overUnderLogger(data, averageScorePerGame);
	
	const predictionResult = averageScorePerGame > (data.overUnderLine || 0)
		? "Over\n"
		: "Under\n";
	
	return predictionResult;
};
// ____________________________________________________________________
