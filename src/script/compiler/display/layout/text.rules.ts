import type { BBox } from "../../../../maths/math";
import type { TupleToUnion } from "../../../../types/typescript.types";
import { OP_TYPES } from "../../../types/operation.types";
import { tokens } from "../../lexer";

export type TText = {
	type: TupleToUnion<[typeof OP_TYPES.TEXT]>;
	text: string;
	pos: [number, number];
	size?: number;
	align?: number;
	color?: string;
	anim?: string;
	action?: unknown[];

	bbox?: BBox;
};

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class TextRules {
	static layoutText($) {
		return $.RULE("layoutText", (options, isMenuItem: boolean) => {
			$.CONSUME(tokens.Text);

			const result: TText = {
				type: OP_TYPES.TEXT,
				text: $.SUBRULE($.strOrVar),
				pos: $.SUBRULE2($.parm_at),
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

			$.OPTION(() => {
				const { name, value, isParm } = $.SUBRULE($.textSpriteProps);

				$.ACTION(() => {
					if (!isParm) options[name] = value;
					else result[name] = value;
				});
			});

			if (isMenuItem) {
				result.action = $.SUBRULE3($.layoutAction);
			}

			return result;
		});
	}
}
