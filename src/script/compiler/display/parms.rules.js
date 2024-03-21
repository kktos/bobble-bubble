import { tokens } from "../lexer.js";

export function parmsRules(parser) {
	const  $ = parser;

	$.RULE("parm_at", () => {
		$.CONSUME(tokens.At);
		$.CONSUME(tokens.Colon);

		const x= $.SUBRULE(parser.numOrVar)

		$.CONSUME(tokens.Comma);
		
		const y= $.SUBRULE2(parser.numOrVar);

		return [ x, y ];
	});

}