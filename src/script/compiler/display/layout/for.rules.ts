import { OP_TYPES } from "../../../types/operation.types";
import { tokens } from "../../lexer";
import type { TRepeat } from "./repeat.rules";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ForRules {
	static layoutFor($) {
		return $.RULE("layoutFor", (options, isMenuItem) => {
			$.CONSUME(tokens.For);

			const result: TRepeat = { type: OP_TYPES.REPEAT, count: 0, items: [], step: { pos: [0, 0] } };

			$.OPTION(() => {
				result.var = $.CONSUME(tokens.StringLiteral).payload;
			});

			const range = $.SUBRULE($.layoutForTwoNumber);
			result.count = range[1];

			$.CONSUME(tokens.OpenCurly);

			$.CONSUME(tokens.Step);
			result.step.pos = $.SUBRULE2($.layoutForTwoNumber);

			result.items = $.SUBRULE($.layoutForItems, {
				ARGS: [options, isMenuItem],
			});

			$.CONSUME(tokens.CloseCurly);

			return result;
		});
	}

	static layoutForTwoNumber($) {
		return $.RULE("layoutForTwoNumber", () => {
			const a = $.SUBRULE($.number);
			$.CONSUME(tokens.Comma);
			const b = $.SUBRULE2($.number);
			return [a, b];
		});
	}

	static layoutForItems($) {
		return $.RULE("layoutForItems", (options, isMenuItem) => {
			$.CONSUME(tokens.Items);
			$.CONSUME(tokens.OpenCurly);

			const items: unknown[] = [];
			$.AT_LEAST_ONE(() => {
				items.push($.SUBRULE($.layoutText, { ARGS: [options, isMenuItem] }));
			});

			$.CONSUME(tokens.CloseCurly);

			return items;
		});
	}
}

/*

	for "idx" 0,10 {
		step 0,40
		items {
			text "%positions.$idx%" at:90,190
			text "%highscores.$idx.score%" at:250,190
			text "%highscores.$idx.round%" at:450,190
			text "%highscores.$idx.name%" at:580,190
		}
	}

*/
