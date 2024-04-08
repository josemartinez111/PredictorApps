// FILE: presentation/custom-logger/over-under-logger.ts
// _______________________________________________

import { GameData } from "../../domain/dataEntities";
import { spacer } from "../../domain/types/typeHelpers";
import { withConsoleColorLogger } from "./colorLogger";
// _______________________________________________

export const overUnderLogger = (data: GameData, averageScorePerGame: number): void => {
	withConsoleColorLogger(`Over/Under Line: ${ data.overUnderLine }`, "netflixRed", true);
	withConsoleColorLogger(`Over/Under Line: ${ data.overUnderLine }`, "netflixRed", true);
	
	const avgScoreMsg = `Average Score Per Game: ${ averageScorePerGame.toFixed(2) }`;
	withConsoleColorLogger(avgScoreMsg, "cyan", true);
	withConsoleColorLogger(spacer, "dodgerBlue", true);
};
// ___________________________________________________________________