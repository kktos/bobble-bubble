export function interpolateString({ vars }, text) {
	if (typeof text !== "string") {
		throw new TypeError("text must be a string !");
	}
	return text.replaceAll(/%(.+?)%/g, (m, varname) => evalExpr({ vars }, `$${varname}`));
}

export function evalVar({ vars }, varname) {
	const [name, ...parms] = varname.split(".");
	if (!vars.has(name)) {
		throw new TypeError(`unknown var "${name}"`);
	}

	let value = vars.get(name);
	if (value === undefined) {
		console.log(`undefined var "${name}"`, varname);
		return "";
	}

	for (let parmIdx = 0; parmIdx < parms.length; parmIdx++) {
		let parm = parms[parmIdx];

		if (parm.match(/^\$/)) {
			parm = vars.get(parm.substr(1));
		}

		value = value[parm];

		if (value === undefined) {
			console.log(`undefined var "${parm}"`, varname);
			return "";
		}
	}

	if (value === undefined) {
		console.log("undefined var", varname);
		return "";
	}
	return value;
}

const VARNAME_REGEX = /\$[a-zA-Z_][a-zA-Z0-9_]*(?:\.\$?[a-zA-Z_][a-zA-Z0-9_]*)*/g;

export function evalExpr({ vars }, varOrExpr) {
	if (Array.isArray(varOrExpr) || typeof varOrExpr === "number") return varOrExpr;

	if (typeof varOrExpr === "string") {
		if (varOrExpr.match(/^\$/)) return evalVar({ vars }, varOrExpr.substring(1));

		// return varOrExpr.replace(/%(.+?)%/, (m, varname) => evalExpr({ vars }, `$${varname}`));
		return interpolateString({ vars }, varOrExpr);
	}

	const exprSrc = varOrExpr.expr;

	const expr = exprSrc.replaceAll(VARNAME_REGEX, (name) => {
		return evalVar({ vars }, name.substring(1));
	});

	// biome-ignore lint/security/noGlobalEval: <explanation>
	const result = eval(expr);

	// console.log(exprSrc, " => ", expr, " = ",result);

	return result;
}

export function evalNumber({ vars }, nameOrNumber) {
	if (typeof nameOrNumber === "number") return nameOrNumber;
	return evalExpr({ vars }, nameOrNumber);
}
