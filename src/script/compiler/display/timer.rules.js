import { tokens } from "../lexer.js";

export function timerRules(parser) {
	const  $ = parser;

    $.RULE("displayTimer", (sheet) => {
		$.CONSUME(tokens.Timer);
		
		const name= $.OPTION(() => $.CONSUME(tokens.StringLiteral).payload);
		const time= $.SUBRULE(parser.number);
		const wannaRepeat= $.OPTION2(() => $.CONSUME(tokens.Repeat));

		const timers= sheet?.timers ? sheet.timers : {};
		timers[name]= {time, repeat: !!wannaRepeat};

		return { name:"timers", value: timers };
    });

    $.RULE("displayOnEvent", (sheet) => {
		$.CONSUME(tokens.On);

		const eventName= $.CONSUME(tokens.StringLiteral).payload;		
		const handlers= sheet?.on ? sheet.on : {};
		handlers[eventName]= { action: $.SUBRULE(parser.layoutActionBlock) };

		return { name:"on", value: handlers };
    });

}