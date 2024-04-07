import { EmbeddedActionsParser } from "chevrotain";
import { debugRules } from "./debug/debug.rules.js";
import { displayRules } from "./display/display.rules.js";
import { editorRules } from "./editor/editor.rules.js";
import { gameRules } from "./game/game.rules.js";
import { levelRules } from "./level/level.rules.js";
import { tokenList, tokens } from "./lexer.js";
import { typesRules } from "./types.rules.js";

export class SheetParser extends EmbeddedActionsParser {
	constructor() {
		super(tokenList);

		// biome-ignore lint/complexity/noUselessThisAlias: <explanation>
		const $ = this;

		$.RULE("sheet", () => {
			return $.OR([
				{ ALT: () => $.SUBRULE(this.displaySheet) },
				{ ALT: () => $.SUBRULE(this.gameSheet) },
				{ ALT: () => $.SUBRULE(this.levelSheet) },
				{ ALT: () => $.SUBRULE(this.editorSheet) },
				{ ALT: () => $.SUBRULE(this.debugSheet) },
			]);
		});

		typesRules(this);

		displayRules(this);
		gameRules(this);
		levelRules(this);
		debugRules(this);
		editorRules(this);

		$.RULE("background", () => {
			$.CONSUME(tokens.Background);
			const value = $.OR([{ ALT: () => $.SUBRULE(this.number) }, { ALT: () => $.SUBRULE(this.htmlColor) }]);
			return { name: "background", value };
		});
		$.RULE("showCursor", () => {
			$.CONSUME(tokens.ShowCursor);
			return { name: "showCursor", value: true };
		});
		$.RULE("font", () => {
			$.CONSUME(tokens.Font);
			const value = $.CONSUME(tokens.StringLiteral).payload;
			return { name: "font", value };
		});

		this.performSelfAnalysis();
	}
}
