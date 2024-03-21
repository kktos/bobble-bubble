import { tokens } from "../lexer.js";

const NUMBER= 1;
const ALIGN= 2;
const COLOR= 3;
const ANIM= 4;

export function textSpritePropsRules(parser) {
	const  $ = parser;

    $.RULE("textSpriteProps", () => {
		let propType= 0;
		const name= $.OR([
			{ ALT: () => { propType= ALIGN; return $.CONSUME(tokens.Align); } },
			{ ALT: () => { propType= NUMBER; return $.CONSUME(tokens.Size); } },
			{ ALT: () => { propType= NUMBER; return $.CONSUME(tokens.Zoom); } },
			{ ALT: () => { propType= COLOR; return $.CONSUME(tokens.Color); } },
			{ ALT: () => { propType= ANIM; return $.CONSUME(tokens.Anim); } },
		]).image;

		let isParm= false;
		$.OPTION(() => {
			$.CONSUME(tokens.Colon);
			isParm= true;
		});

		let valueType= 0;
		let value;
		$.OR2([
			{ ALT: () => { valueType= NUMBER; value= $.SUBRULE(parser.number); } },
			{ ALT: () => { valueType= COLOR; value= $.SUBRULE(parser.htmlColor); } },
			{ ALT: () => { valueType= ALIGN; $.CONSUME(tokens.Left); value= 1; } },
			{ ALT: () => { valueType= ALIGN; $.CONSUME(tokens.Right); value= 3; } },
			{ ALT: () => { valueType= ALIGN; $.CONSUME(tokens.Center); value= 2; } },
			{ ALT: () => { 
				valueType= ANIM; 
				value= {
					name: $.CONSUME(tokens.StringLiteral).payload
				} 
			} },
		])

		$.ACTION(() => {
			switch(propType) {
				case ALIGN:
					if(valueType!==NUMBER && valueType !== ALIGN)
						throw new TypeError(`Invalid value ${value} for ${name}`);
					break;
				case COLOR:
					if(valueType!==COLOR)
						throw new TypeError(`Invalid value ${value} for ${name}`);
					break;
				case NUMBER:
					if(valueType!==NUMBER)
						throw new TypeError(`Invalid value ${value} for ${name}`);
					break;
				case ANIM:
					if(valueType!==ANIM)
						throw new TypeError(`Invalid value ${value} for ${name}`);
					break;
			}
		});

		return { name, value, isParm };
    });


}
