import { DIRECTIONS } from "../types/direction.type.js";
import { tokens } from "./lexer.js";

export function parmsRules(parser) {
	const $ = parser;

	$.RULE("parm_at", () => {
		$.CONSUME(tokens.At);
		$.CONSUME(tokens.Colon);

		const x = $.SUBRULE(parser.numOrVar);

		$.CONSUME(tokens.Comma);

		const y = $.SUBRULE2(parser.numOrVar);

		return [x, y];
	});

	$.RULE("parm_range", () => {
		$.CONSUME(tokens.Range);
		$.CONSUME(tokens.Colon);
		const x = $.SUBRULE(parser.number);
		$.CONSUME(tokens.Comma);
		const y = $.SUBRULE2(parser.number);
		return [x, y];
	});

	$.RULE("parm_dir", () => {
		$.CONSUME(tokens.Dir);
		$.CONSUME(tokens.Colon);

		return $.OR([
			{
				ALT: () => {
					$.CONSUME(tokens.Left);
					return DIRECTIONS.LEFT;
				},
			},
			{
				ALT: () => {
					$.CONSUME(tokens.Right);
					return DIRECTIONS.RIGHT;
				},
			},
		]);
	});
}
