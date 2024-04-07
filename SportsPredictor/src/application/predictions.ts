// FILE: application/predictions.ts
// _______________________________________________

import { GameData } from "../domain/dataEntities";
import {
	withColorLogger,
	withConsoleColorLogger,
} from "../infrastructure/colorLogger";
import {
	calculateEloRating, calculateSpreadFactor,
	calculateWinPercentagePythagorean,
} from "./calculations";
// _______________________________________________

export const predictOutcome = (data: GameData): void => {
	const pythagoreanWinPercentage1 = calculateWinPercentagePythagorean(
		data.team1,
	);
	const pythagoreanWinPercentage2 = calculateWinPercentagePythagorean(
		data.team2,
	);
	const newEloRating1 = calculateEloRating(
		data.team1,
		data.team2,
		data.kFactor || 20,
	);
	const newEloRating2 = calculateEloRating(
		data.team2,
		data.team1,
		data.kFactor || 20,
	);
	const spreadFactor1 =
		data.spread && data.favoredTeam === data.team1.name
			? calculateSpreadFactor(data.team1, data.spread)
			: 1;
	const spreadFactor2 =
		data.spread && data.favoredTeam === data.team2.name
			? calculateSpreadFactor(data.team2, data.spread)
			: 1;
	
	let winProbability1 = (pythagoreanWinPercentage1 + newEloRating1 / 2400) / 2; // Simple average.
	winProbability1 *= spreadFactor1;
	let winProbability2 = (pythagoreanWinPercentage2 + newEloRating2 / 2400) / 2; // Simple average.
	winProbability2 *= spreadFactor2;
	
	// Normalise the win probabilities
	let totalProbability = winProbability1 + winProbability2;
	winProbability1 = winProbability1 / totalProbability;
	winProbability2 = winProbability2 / totalProbability;
	
	withConsoleColorLogger("_____________________________________________________", "dodgerBlue", true);
	withConsoleColorLogger(`Teams: ${ data.team1.name } vs ${ data.team2.name }`, "netflixRed", true);
	if (data.homeTeam === data.team1.name) {
		withConsoleColorLogger(`Home Team: ${ data.team1.name }`, "netflixRed", true);
		withConsoleColorLogger("_____________________________________________________", "dodgerBlue", true);
	} else if (data.homeTeam === data.team2.name) {
		withConsoleColorLogger(`Home Team: ${ data.team2.name }`, "netflixRed", true);
		withConsoleColorLogger("_____________________________________________________", "dodgerBlue", true);
	}
	
	if (data.spread) {
		withConsoleColorLogger(`Spread: ${ data.spread }`, "cyan", true);
	}
	
	withConsoleColorLogger("_____________________________________________________", "dodgerBlue", true);
	
	withConsoleColorLogger(
		`Team 1 (${ data.team1.name }) Win Probability: ${ withColorLogger((
			winProbability1 * 100
		).toFixed(2), "cyan", true) }%`, "netflixRed", true,
	);
	
	withConsoleColorLogger(
		`Team 2 (${ data.team2.name }) Win Probability: ${ withColorLogger((
			winProbability2 * 100
		).toFixed(2), "cyan", true) }%`, "netflixRed", true,
	);
	
	withConsoleColorLogger("_____________________________________________________" , "dodgerBlue", true);
	
	if (winProbability1 > winProbability2) {
		withConsoleColorLogger(`Expected winner: ${ data.team1.name }`, "netflixRed", true);
		withConsoleColorLogger("_____________________________________________________", "dodgerBlue", true);
	} else if (winProbability1 < winProbability2) {
		withConsoleColorLogger(`Expected winner: ${ data.team2.name }`, "cyan", true);
		withConsoleColorLogger("_____________________________________________________", "dodgerBlue", true);
	} else {
		withConsoleColorLogger(`The game could go either way.`, "netflixRed", true);
		withConsoleColorLogger("_____________________________________________________", "dodgerBlue", true);
	}
};
// ____________________________________________________________________

export const predictOverUnder = (data: GameData): string => {
	const totalScored = data.team1.scored + data.team2.scored;
	const totalAllowed = data.team1.allowed + data.team2.allowed;
	const totalGamesPlayed =
		(data.team1.totalGamesPlayed || 0) + (data.team2.totalGamesPlayed || 0);
	
	const averageScorePerGame = (totalScored + totalAllowed) / totalGamesPlayed;
	
	withConsoleColorLogger(`Over/Under Line: ${ data.overUnderLine }`, "netflixRed", true);
	withConsoleColorLogger(`Over/Under Line: ${ data.overUnderLine }`, "netflixRed", true);
	withConsoleColorLogger(`Average Score Per Game: ${ averageScorePerGame.toFixed(2) }`, "cyan", true);
	withConsoleColorLogger("_____________________________________________________", "dodgerBlue", true);
	
	return averageScorePerGame > (data.overUnderLine || 0) ? "Over\n" : "Under\n";
};
// ____________________________________________________________________


// ____________________________________________________________________
