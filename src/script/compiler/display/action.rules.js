import { tokens } from "../lexer.js";

export function actionRules(parser) {
	const $ = parser;

	$.RULE("layoutAction", () => {
		$.CONSUME(tokens.Action);
		$.CONSUME(tokens.Colon);

		return $.SUBRULE(parser.layoutActionBlock);
	});

	$.RULE("layoutActionBlock", () => {
		const result = [];

		$.CONSUME(tokens.OpenCurly);

		$.AT_LEAST_ONE(() => {
			result.push($.SUBRULE(parser.layoutActionStatement));
		});

		$.CONSUME(tokens.CloseCurly);

		return result;
	});

	$.RULE("layoutActionStatement", () => {
		const result = [];
		$.AT_LEAST_ONE_SEP({
			SEP: tokens.Dot,
			DEF: () => {
				result.push($.SUBRULE(parser.layoutActionFunctionCall));
			},
		});
		$.ACTION(() => {
			if (result[0].name.length === 1) result[0].name.unshift("SYSTEM");
		});
		return result;
	});

	$.RULE("layoutActionFunctionCall", () => {
		const parts = [];
		$.AT_LEAST_ONE_SEP({
			SEP: tokens.Dot,
			DEF: () => {
				parts.push($.SUBRULE(parser.layoutActionFunctionName));
			},
		});

		const result = {
			name: parts,
			args: [],
		};

		$.CONSUME(tokens.OpenParent);

		const args = result.args;
		$.MANY_SEP({
			SEP: tokens.Comma,
			DEF: () => {
				$.OR([
					{ ALT: () => args.push($.SUBRULE(parser.number)) },
					{ ALT: () => args.push($.CONSUME2(tokens.Identifier).image) },
					{ ALT: () => args.push($.CONSUME2(tokens.Left).image) },
					{ ALT: () => args.push($.CONSUME2(tokens.Right).image) },
					{ ALT: () => args.push($.CONSUME2(tokens.Variable).image) },
					{ ALT: () => args.push($.CONSUME2(tokens.StringLiteral).image) },
				]);
			},
		});

		$.CONSUME(tokens.CloseParent);

		return result;
	});

	$.RULE("layoutActionFunctionName", () => {
		return $.OR([
			{ ALT: () => $.CONSUME(tokens.Identifier).image },
			{ ALT: () => $.CONSUME(tokens.Timer).image },
			{ ALT: () => $.CONSUME(tokens.Sprite).image },
			{ ALT: () => $.CONSUME(tokens.Dir).image },
			{ ALT: () => $.CONSUME(tokens.Sound).image },
			{ ALT: () => $.CONSUME(tokens.Loop).image },
			{ ALT: () => $.CONSUME(tokens.Play).image },
			{ ALT: () => $.CONSUME(tokens.Text).image },
		]);
	});
}
