import { OP_TYPES } from "../../types/operation.types.js";
import { tokens } from "../lexer.js";

export function rectRules(parser) {
	const $ = parser;

	$.RULE("layoutRect", (options, isMenuItem) => {
		$.CONSUME(tokens.Rect);

		const result = {
			type: OP_TYPES.RECT,
			color: options?.color ?? "white",
			pos: $.SUBRULE(parser.parm_at),
			width: $.SUBRULE(parser.layoutViewWidth),
			height: $.SUBRULE(parser.layoutViewHeight),
			action: isMenuItem ? $.SUBRULE(parser.layoutAction) : undefined,
		};

		return result;
	});
}
