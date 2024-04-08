// FILE: main.ts
// _______________________________________________

import { GameDataLoader, runApp } from "./presentation/gameDataLoader";
import { MatchFullStats } from "./presentation/matchUpDataLoader";
// _______________________________________________

function main() {
	const loader = GameDataLoader(); // Initialize once
	
	const {
		team1Data,
		team2Data,
		gameDataInput,
	} = MatchFullStats(loader);
	
	runApp(
		loader,
		team1Data,
		team2Data,
		gameDataInput
	);
}

// _______________________________________________

main();
/**
   FOR ALL LINES CHECK AT THE ( HALF-5 INNINGS )
      __________________________________________________________________
   1. +MIA @ NYY (UNDER?/8 {6.21})=??? (Maybe->Probabilities: 48.09% at 51.91%)game=❌|over/under=❌
      __________________________________________________________________
   2. +DET @ PIT (UNDER/8.5 {4.33})=??? (Maybe->Probabilities: 56.81% at 43.19%)game=✅|over/under=❌
      __________________________________________________________________
   3. -MIL @ CIN (UNDER/9.5 {6.06})=??? (Maybe->Probabilities: 56.22% at 43.78%)game=✅|over/under=✅
      __________________________________________________________________
   4. -SEA @ TOR (UNDER/8 {6.07})=COL (Maybe->Probabilities: 59.96% at 40.04%)game=❌|over/under=✅
      __________________________________________________________________
	   
	   
   5. BOS @ -MIN (OVER/8 {8.43})=MIN (Maybe->Probabilities: 40.05% at 59.95%)game=❌|over/under=✅
      __________________________________________________________________
   6. ARI @ -MIL (OVER/7.5 {8.56})=MIL (Maybe->Probabilities: 45.46% at 54.54%)game=❌|over/under=❌
      __________________________________________________________________
 */
// _______________________________________________