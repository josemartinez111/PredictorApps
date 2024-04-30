// FILE: main.ts
// _______________________________________________

import { DataInputLogic } from "./domain/types/typeHelpers";
import { chooseGameType, GameDataLoader, runApp } from "./presentation/gameDataLoader";
// _______________________________________________

async function main() {
	const loader = GameDataLoader(); // Initialize once
	const isGame: Array<string> = ["input", "manual"]
	
	const {
		team1Data,
		team2Data,
		gameDataInput
	} = await chooseGameType({
		whichGameType: isGame[1],
		loader: loader,
	});
	
	runApp(
		loader,
		team1Data,
		team2Data,
		<DataInputLogic>gameDataInput
	)
}
// _______________________________________________

main().catch((err: unknown): void => {
	if (err instanceof Error)
		console.error('Error starting the server:', err.message);
	// Re-throw the error for further handling
	throw err;
});
// _____________________________________________________________________

/**
   FOR ALL LINES CHECK AT THE ( HALF-5 INNINGS ) ❌✅
      __________________________________________________________________
   1. +OAK @ BAL (UNDER/8.5 {6.02})=DET/8 (Maybe->Probabilities: 52.45% at 47.55%)
      game=✅|over/under=✅
      __________________________________________________________________
   2. +BAL @ BOS (UNDER/8 {6.53})=BAL/8 (Maybe->Probabilities: 47.70% at 52.30%)
      game=✅|over/under=✅
      __________________________________________________________________
   3. -LAD @ MIN (UNDER/8.5 {6.70})=MIN/5 (Maybe->Probabilities: 65.35% at 34.65%)
      game=❌  |over/under=✅
      __________________________________________________________________
   4. -PHI @ STL (UNDER/8 {6.48})=STL/7 (Maybe->Probabilities: 47.76% at 52.24%)
        game=✅ |over/under=✅
      __________________________________________________________________
	   
	   
   5. BOS @ -MIN (OVER/8 {})= (Maybe->Probabilities: 40.05% at 59.95%)
      game=|over/under=
      __________________________________________________________________
   6. ARI @ -MIL (OVER/7.5 {8.56})=MIL/7 (Maybe->Probabilities: 45.46% at 54.54%)
      game=❌|over/under=❌
      __________________________________________________________________
	 7. ARI @ -MIL (OVER/7.5 {8.56})=MIL/7 (Maybe->Probabilities: 45.46% at 54.54%)
	      game=❌|over/under=❌
	      __________________________________________________________________
	 8. ARI @ -MIL (OVER/7.5 {8.56})=MIL/7 (Maybe->Probabilities: 45.46% at 54.54%)
	      game=❌|over/under=❌
	      __________________________________________________________________
	   
	 9. BOS @ -MIN (OVER/8 {})= (Maybe->Probabilities: 40.05% at 59.95%)
      game=|over/under=
      __________________________________________________________________
   10. ARI @ -MIL (OVER/7.5 {8.56})=MIL/7 (Maybe->Probabilities: 45.46% at 54.54%)
      game=❌|over/under=❌
      __________________________________________________________________
	 11. ARI @ -MIL (OVER/7.5 {8.56})=MIL/7 (Maybe->Probabilities: 45.46% at 54.54%)
	      game=❌|over/under=❌
	      __________________________________________________________________
	 12. ARI @ -MIL (OVER/7.5 {8.56})=MIL/7 (Maybe->Probabilities: 45.46% at 54.54%)
	      game=❌|over/under=❌
	      __________________________________________________________________
 */
// _______________________________________________