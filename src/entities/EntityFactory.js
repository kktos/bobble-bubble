import { entityClasses } from "./entities.js";

export function createEntity(resourceManager, name, ...args) {
	if (entityClasses[name]) {
		const entity = new entityClasses[name](resourceManager, ...args);
		return entity;
	}
	throw new TypeError(`Unknown Entity Type ${name}`);
}
