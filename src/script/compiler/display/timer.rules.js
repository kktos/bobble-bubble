import { tokens } from "../lexer.js";

export function timerRules(parser) {
	const $ = parser;

	$.RULE("displayTimer", (sheet) => {
		$.CONSUME(tokens.Timer);

		const name = $.OPTION(() => $.CONSUME(tokens.StringLiteral).payload);

		$.CONSUME(tokens.MS);
		$.CONSUME(tokens.Colon);
		const time = $.SUBRULE(parser.number);

		const repeatCount = $.OPTION2(() => {
			let repeat = Number.POSITIVE_INFINITY;
			$.CONSUME(tokens.Repeat);
			$.OPTION3(() => {
				$.CONSUME2(tokens.Colon);
				repeat = $.SUBRULE2(parser.number);
			});
			return repeat;
		});

		const timers = sheet?.timers ? sheet.timers : {};
		timers[name] = { time, repeat: repeatCount };

		return { name: "timers", value: timers };
	});
}
