import { OP_TYPES } from "../../types/operation.types.js";
import { tokens } from "../lexer.js";
import { actionRules } from "./action.rules.js";

export function textRules(parser) {
	const $ = parser;

	$.RULE("layoutText", (options, isMenuItem) => {
		$.CONSUME(tokens.Text);

		const result = {
			type: OP_TYPES.TEXT,
			// text: $.CONSUME(tokens.StringLiteral).payload
			text: $.SUBRULE(parser.strOrVar),
		};
		if (options?.size) {
			result.size = options.size;
		}
		if (options?.align) {
			result.align = options.align;
		}
		if (options?.color) {
			result.color = options.color;
		}
		if (options?.anim) {
			result.anim = options.anim;
		}

		result.pos = $.SUBRULE2(parser.parm_at);

		$.OPTION(() => {
			const { name, value, isParm } = $.SUBRULE(parser.textSpriteProps);

			$.ACTION(() => {
				if (!isParm) options[name] = value;
				else result[name] = value;
			});
		});

		if (isMenuItem) {
			result.action = $.SUBRULE3(parser.layoutAction);
		}

		return result;
	});

	actionRules(parser);
}
