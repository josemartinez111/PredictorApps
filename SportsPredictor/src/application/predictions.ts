// FILE: application/predictions.ts
// _______________________________________________

import { GameData } from "../domain/dataEntities";
import { spacerH1, withConsoleColorLogger } from "../infrastructure/colorLogger";
import {
	calcEloRating, calcSpreadFactor,
	calcWinPctPythagorean, calcRegressionFactor,
} from "./calculations";
// _______________________________________________

const spacer = spacerH1("_", 55, "dodgerBlue");
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
	
	outcomeMessage = winProbability1 > winProbability2
		? `Expected winner: ${ data.team1.name }`
		: winProbability1 < winProbability2
			? `Expected winner: ${ data.team2.name }`
			: "The game could go either way.";
	
	// Logging structure
	withConsoleColorLogger(spacer, "dodgerBlue", true);
	withConsoleColorLogger(
		`Teams: ${ data.team1.name } vs ${ data.team2.name }`,
		"netflixRed", true,
	);
	
	if (data.homeTeam === data.team1.name) {
		withConsoleColorLogger(
			`Home Team: ${ data.team1.name }`,
			"netflixRed",
			true,
		);
	} else if (data.homeTeam === data.team2.name) {
		withConsoleColorLogger(
			`Home Team: ${ data.team2.name }`,
			"netflixRed",
			true,
		);
	}
	withConsoleColorLogger(spacer, "dodgerBlue", true);
	
	if (data.spread) {
		withConsoleColorLogger(`Spread: ${ data.spread }`, "cyan", true);
	}
	
	const msgTeam1 = `Team 1 (${ data.team1.name }) Win Probability: ${ (winProbability1 * 100).toFixed(2) }%`;
	withConsoleColorLogger(msgTeam1, "cyan", true);
	
	const msgTeam2 = `Team 2 (${ data.team2.name }) Win Probability: ${ (winProbability2 * 100).toFixed(2) }%`;
	withConsoleColorLogger(msgTeam2, "cyan", true);
	
	const isColor = winProbability1 === winProbability2
		? "netflixRed"
		: winProbability1 > winProbability2
			? "netflixRed"
			: "cyan";
	
	withConsoleColorLogger(outcomeMessage, isColor, true);
	withConsoleColorLogger(spacer, "dodgerBlue", true);
	
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
	
	withConsoleColorLogger(`Over/Under Line: ${ data.overUnderLine }`, "netflixRed", true);
	withConsoleColorLogger(`Over/Under Line: ${ data.overUnderLine }`, "netflixRed", true);
	
	const avgScoreMsg = `Average Score Per Game: ${ averageScorePerGame.toFixed(2) }`;
	withConsoleColorLogger(avgScoreMsg, "cyan", true);
	withConsoleColorLogger(spacer, "dodgerBlue", true);
	
	const predictionResult = averageScorePerGame > (data.overUnderLine || 0) ? "Over\n" : "Under\n";
	
	return predictionResult;
};
// ____________________________________________________________________
