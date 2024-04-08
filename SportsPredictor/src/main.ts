// FILE: main.ts
// _______________________________________________

import { predictOutcome, predictOverUnder } from "./application/predictions";
import { withConsoleColorLogger } from "./infrastructure/colorLogger";
import { GameDataLoader } from "./presentation/gameDataLoader";

// _______________________________________________

function main() {
	const loader = GameDataLoader(); // Initialize once
	
	// Example team data, ideally loaded from a database or external source
	const team1Data = loader.createTeamData(
		"ARI",
		517,
		482,
		3040,
		6,
		4,
		23,
		18,
		20,
		11,
		162,
	);
	
	const team2Data = loader.createTeamData(
		"MIL",
		414,
		437,
		3440,
		4,
		6,
		21,
		16,
		16,
		18,
		162,
	);
	
	const gameDataInput = {
		sport: "Baseball",
		overUnderLine: 7.5,
		spread: 1.5,
		homeTeam: "MIL",
		favoredTeam: "MIL",
	};
	
	const gameData = loader.loadGameData(
		team1Data,
		team2Data,
		gameDataInput,
	);
	
	withConsoleColorLogger(`=================== [ ${ gameData.sport } ] ====================`, "dodgerBlue", true);
	predictOutcome(gameData);
	
	const overUnderPrediction = predictOverUnder(gameData);
	
	withConsoleColorLogger(
		`Over/Under prediction: ${ overUnderPrediction }`,
		"cyan",
		true,
	);
}

// _______________________________________________

main();
/**
   FOR ALL LINES CHECK AT THE ( HALF-5 INNINGS )
      __________________________________________________________________
   1. -TOR @ MIA (UNDER?/8.5 {8.07})=TOR (Maybe->Probabilities: 55.62% at 44.38%)game=❌|over/under=❌
      __________________________________________________________________
   2. KC @ -DET (UNDER/9 {8.36})=? (Maybe->Probabilities: 50.13% at 49.87%)game=✅|over/under=❌
      __________________________________________________________________
   3. -CHC @ PIT (UNDER/9 {8.42})=CHC (Maybe->Probabilities: 64.54% at 35.46%)game=✅|over/under=✅
      __________________________________________________________________
   4. -COL @ CIN (UNDER/10.5 {9.44})=COL (Maybe->Probabilities: 57.88% at 42.12%)game=❌|over/under=✅
      __________________________________________________________________
   5. BOS @ -MIN (OVER/8 {8.43})=MIN (Maybe->Probabilities: 40.05% at 59.95%)game=❌|over/under=✅
      __________________________________________________________________
   6. ARI @ -MIL (OVER/7.5 {8.56})=MIL (Maybe->Probabilities: 45.46% at 54.54%)game=❌|over/under=❌
      __________________________________________________________________
 */
// _______________________________________________