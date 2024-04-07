import { tokens } from "../lexer.js";

const CONCAT = Symbol("concat");

export function levelRules(parser) {
	const $ = parser;

	$.RULE("levelSheet", () => {
		$.CONSUME(tokens.Level);

		const sheet = {
			type: "level",
			name: $.CONSUME(tokens.StringLiteral).payload,
		};

		$.CONSUME(tokens.OpenCurly);

		$.MANY(() => {
			const { name, value, [CONCAT]: wannaConcat } = $.SUBRULE(parser.levelProps);
			if (wannaConcat) {
				if (!sheet[name]) sheet[name] = [];
				sheet[name].push(value);
			} else sheet[name] = value;
		});

		$.CONSUME(tokens.CloseCurly);

		return sheet;
	});

	$.RULE("levelProps", () => {
		return $.OR([
			{ ALT: () => $.SUBRULE(parser.background) },
			{ ALT: () => $.SUBRULE(parser.showCursor) },
			{ ALT: () => $.SUBRULE(parser.font) },
			{ ALT: () => $.SUBRULE(parser.levelSettings) },
			{ ALT: () => $.SUBRULE(parser.levelSprite) },
		]);
	});

	$.RULE("levelSettings", () => {
		$.CONSUME(tokens.Settings);
		$.CONSUME(tokens.OpenCurly);

		const settings = {};
		$.MANY(() => {
			const { name, value } = $.SUBRULE(parser.layoutSet);
			settings[name] = value;
		});

		$.CONSUME(tokens.CloseCurly);

		return { name: "settings", value: settings };
	});

	$.RULE("levelSprite", () => {
		$.CONSUME(tokens.Sprite);
		return {
			name: "sprites",
			value: {
				name: $.CONSUME(tokens.StringLiteral).payload,
				pos: $.SUBRULE(parser.parm_at),
				dir: $.SUBRULE(parser.parm_dir),
			},
			[CONCAT]: true,
		};
	});
}
