import { tokens } from "../lexer.js";

export function levelRules(parser) {
	const  $ = parser;

	$.RULE("levelSheet", () => {
		$.CONSUME(tokens.Level);

		const sheet= {
			type: "level",
			name: $.CONSUME(tokens.StringLiteral).payload
		 };

		$.CONSUME(tokens.OpenCurly);

		$.MANY(() => {
			const {name,value}= $.SUBRULE(parser.levelProps);
			sheet[name] = value;
		});

		$.CONSUME(tokens.CloseCurly);

		return sheet;
    });

    $.RULE("levelProps", () => {
		return $.OR([
			{ ALT:() => $.SUBRULE(parser.background) },
			{ ALT:() => $.SUBRULE(parser.showCursor) },
			{ ALT:() => $.SUBRULE(parser.font) },
			{ ALT:() => $.SUBRULE(parser.levelSettings) },
		]);
    });

	$.RULE("levelSettings", () => {
		$.CONSUME(tokens.Settings);
		$.CONSUME(tokens.OpenCurly);

		const settings= {};
		$.MANY(() => {
			const {name,value}= $.SUBRULE(parser.layoutSet);
			settings[name] = value;
		});

		$.CONSUME(tokens.CloseCurly);

		return {name:"settings", value: settings};
    });

}