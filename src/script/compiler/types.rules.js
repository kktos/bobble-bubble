import { tokens } from "./lexer.js";

export function typesRules(parser) {
	const $ = parser;

	$.RULE("number", () => {
		const isNegative = $.OPTION(() => $.CONSUME(tokens.Minus));
		const numberStr = $.CONSUME(tokens.Integer).image;
		return Number.parseInt(numberStr) * (isNegative ? -1 : 1);
	});

	$.RULE("variable", () => {
		// return $.CONSUME(tokens.Variable).image.substring(1);
		return $.CONSUME(tokens.Variable).image;
	});

	$.RULE("htmlColor", () => {
		const colorName = () => $.CONSUME(tokens.Identifier).image;
		const colorHex = () => $.CONSUME(tokens.HexNumber).image;
		return $.OR([{ ALT: colorHex }, { ALT: colorName }]);
	});

	$.RULE("numOrVar", () => {
		return $.OR([{ ALT: () => $.SUBRULE(parser.number) }, { ALT: () => $.SUBRULE(parser.variable) }]);
	});

	$.RULE("strOrVar", () => {
		return $.OR([{ ALT: () => $.CONSUME(tokens.StringLiteral).payload }, { ALT: () => $.SUBRULE(parser.variable) }]);
	});
}
