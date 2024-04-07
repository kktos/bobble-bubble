import { OP_TYPES } from "../../types/operation.types.js";
import { tokens } from "../lexer.js";

export function spriteRules(parser) {
	const $ = parser;

	$.RULE("layoutSprite", (options) => {
		$.CONSUME(tokens.Sprite);

		const result = {
			type: OP_TYPES.SPRITE,
			sprite: $.CONSUME(tokens.StringLiteral).payload,
			zoom: options?.zoom ?? 1,
			pos: $.SUBRULE(parser.parm_at),
			range: undefined,
			dir: undefined,
		};

		$.OPTION(() => {
			result.range = $.SUBRULE(parser.parm_range);
		});

		$.OPTION2(() => {
			result.dir = $.SUBRULE(parser.parm_dir);
		});

		return result;
	});
}
