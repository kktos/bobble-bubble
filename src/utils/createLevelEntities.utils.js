import { createEntity } from "../entities/EntityFactory.js";
import { entityNames } from "../entities/entities.js";

export function createLevelEntities(resourceManager, grid, sprites) {
	const entities = [];
	for (const sprite of sprites) {
		const className = entityNames[sprite.name];
		const { x, y } = grid.toCoord(sprite.pos[0], sprite.pos[1]);
		const entity = createEntity(resourceManager, className, x, y, sprite.dir);
		entities.push(entity);
	}
	return entities;
}
