import { SYSTEM, views } from "../../layers/display/views/views.js";

export function execAction({gc, vars}, action) {

	let result= undefined;

	for (let idx = 0; idx < action.length; idx++) {
		const fnCall = action[idx];
		const args= [];

		for (let argsIdx = 0; argsIdx <fnCall.args.length; argsIdx++) {
			const arg= fnCall.args[argsIdx]; 
			if(typeof arg === "number") {
				args.push(arg);
				continue;
			}
			const strMatches = arg.match(/^"(.*)"$/);
			if(strMatches) {
				args.push(strMatches[1]);
				continue;
			}

			const varMatches = arg.match(/^\$(.*)$/);
			if(varMatches) {
				const varname= varMatches[1];
				if(!vars.has(varname))
					throw new TypeError(`Unknown Variable "${varname}" !?!`);
				args.push( vars.get(varname) );
				continue;
			}

			args.push( arg );
		}

		let fn= fnCall.name.length === 1 ? views[SYSTEM] : null;
		let self= fn;
		for(let partIdx= 0; partIdx<fnCall.name.length; partIdx++) {
			const part= fnCall.name[partIdx];
			if(!self) {
				self= vars.get(part);
				fn= self;
			} else {
				fn= fn[part];
			}
			if(!fn) {
				console.error("unknown action !", fnCall.name.join("."), args);
				return;
			}
		}

		result= fn.call(self, ...args);

	}
	return result;
}