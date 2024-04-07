import { tokens } from "../lexer.js";

export function soundRules(parser) {
	const $ = parser;

	$.RULE("sound", (sheet) => {
		$.CONSUME(tokens.Sound);
		const sounds = sheet?.sounds ? sheet.sounds : {};
		const name = $.CONSUME(tokens.StringLiteral).payload;
		sounds[name] = {
			play: false,
		};
		$.OPTION(() => {
			sounds[name].play = !!$.CONSUME(tokens.Play);
		});
		return { name: "sounds", value: sounds };
	});
}
