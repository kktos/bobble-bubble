import { tokens } from "../lexer.js";

export function setRules(parser) {
	const  $ = parser;

    $.RULE("layoutSet", () => {
		// $.CONSUME(tokens.Set);

		const result= {
			type: "set",
			// name: $.CONSUME(tokens.StringLiteral).payload
			name: $.CONSUME(tokens.Identifier).image
		};

		$.CONSUME(tokens.Equal);

		result.value = $.SUBRULE(parser.layoutSetValue);

		return result;
    });

    $.RULE("layoutSetValue", () => {
		return $.OR([
			{ ALT: () => $.CONSUME(tokens.StringLiteral).payload },
			{ ALT: () => $.SUBRULE(parser.numOrVar) },
			{ ALT: () => $.SUBRULE(parser.layoutSetValueArray) },
			{ ALT: () => $.SUBRULE(parser.layoutSetEval) },
		]);
    });

    $.RULE("layoutSetEval", () => {
		$.CONSUME(tokens.Eval);
		$.CONSUME(tokens.OpenParent);
		const expr= $.CONSUME(tokens.StringLiteral).payload;
		$.CONSUME(tokens.CloseParent);
		return {expr};
	});

    $.RULE("layoutSetValueArray", () => {
		$.CONSUME(tokens.OpenBracket);

		const result= [];

		$.MANY_SEP({
			SEP: tokens.Comma,
			DEF: () => {
				result.push( $.CONSUME(tokens.StringLiteral).payload );
			}
		});

		$.CONSUME(tokens.CloseBracket);

		return result;
    });
}