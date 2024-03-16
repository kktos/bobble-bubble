import { tokens } from "../lexer.js";

export function defAnimRules(parser) {
	const  $ = parser;

	$.RULE("layoutDefAnim", (options) => {
		$.CONSUME(tokens.Def);
		$.CONSUME(tokens.Anim);

		const result= {
			type: "anim",
			name: $.CONSUME(tokens.StringLiteral).payload
		};

		$.CONSUME(tokens.OpenCurly);

		$.AT_LEAST_ONE(() => {
			const {name,value}= $.OR([
				{ ALT: () => $.SUBRULE(parser.layoutDefAnimPath) },
				{ ALT: () => $.SUBRULE(parser.layoutDefAnimSpeed) },
			]);
			result[name]= value;
		});

		$.CONSUME(tokens.CloseCurly);

		return result;
	});

	$.RULE("layoutDefAnimPath", () => {
		$.CONSUME(tokens.Path);
		return {name: "path", value: $.SUBRULE(parser.layoutActionBlock)};
	});

	$.RULE("layoutDefAnimSpeed", () => {
		$.CONSUME(tokens.Speed);
		return {name:"speed", value:$.SUBRULE(parser.number)};
	});

}