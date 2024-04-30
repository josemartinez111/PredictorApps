// FILE: presentation/custom-logger/over-under-logger.ts
// _______________________________________________

import { GameData } from "../../domain/dataEntities";
import { spacer } from "../../domain/types/typeHelpers";
import { Color, withConsoleColorLogger } from "./colorLogger";
// _______________________________________________

export const overUnderLogger = (data: GameData, averageScorePerGame: number): void => {
	withConsoleColorLogger(`Over/Under Line: ${ data.overUnderLine }`, Color.NetflixRed, true);
	withConsoleColorLogger(`Over/Under Line: ${ data.overUnderLine }`, Color.NetflixRed, true);
	
	const avgScoreMsg = `Average Score Per Game: ${ averageScorePerGame.toFixed(2) }`;
	withConsoleColorLogger(avgScoreMsg, Color.BrightSkyBlue, true);
	withConsoleColorLogger(spacer, Color.DodgerBlue, true);
};
// ___________________________________________________________________