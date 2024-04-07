import { OP_TYPES } from "../../types/operation.types.js";
import { tokens } from "../lexer.js";

export function imageRules(parser) {
	const $ = parser;

	$.RULE("layoutImage", (options) => {
		$.CONSUME(tokens.Image);

		const result = {
			type: OP_TYPES.IMAGE,
			sprite: $.CONSUME(tokens.StringLiteral).payload,
		};
		if (options?.zoom) {
			result.zoom = options.zoom;
		}

		result.pos = $.SUBRULE(parser.parm_at);

		$.OPTION(() => {
			result.range = $.SUBRULE(parser.parm_range);
		});

		return result;
	});
}
