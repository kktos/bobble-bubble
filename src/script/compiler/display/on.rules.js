import { tokens } from "../lexer.js";

export function onRules(parser) {
	const $ = parser;

	$.RULE("displayOnEvent", (sheet) => {
		$.CONSUME(tokens.On);

		const eventName = $.OR([{ ALT: () => $.CONSUME(tokens.StringLiteral).payload }, { ALT: () => $.CONSUME(tokens.Identifier).image }]);
		const handlers = sheet?.on ? sheet.on : {};
		handlers[eventName] = { action: $.SUBRULE(parser.layoutActionBlock) };

		return { name: "on", value: handlers };
	});
}
