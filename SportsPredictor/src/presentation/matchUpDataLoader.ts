// FILE: presentation/matchUpDataLoader.ts
// _______________________________________________

import { MatchFullStatsParams } from "../domain/types/typeHelpers";
// _______________________________________________

export function MatchFullStats(loader: MatchFullStatsParams) {
	// Example team data, ideally loaded from a database or external source
	const team1Data = loader.createTeamData(
		"SEA",
		500,
		450,
		303,
		7,
		3,
		3,
		4,
		1,
		2,
		162,
	);
	
	const team2Data = loader.createTeamData(
		"TOR",
		367,
		500,
		104,
		3,
		7,
		0,
		0,
		4,
		6,
		162,
	);
	
	const gameDataInput = {
		sport: "Baseball",
		overUnderLine: 8,
		spread: 1.5,
		homeTeam: "SEA",
		favoredTeam: "TOR",
	};
	return { team1Data, team2Data, gameDataInput };
}

// _______________________________________________