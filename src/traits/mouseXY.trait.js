import Trait from "./Trait.js";

export class MouseXYTrait extends Trait {
	update(gc, entity, scene) {
		const bbox = scene.bbox;

		entity.left = gc.mouse.x;
		if (entity.left < bbox.x) entity.left = bbox.x;
		else if (entity.right > bbox.dx) entity.left = bbox.dx - entity.size.x;

		entity.top = gc.mouse.y;
		if (entity.top < bbox.x) entity.left = top.y;
		else if (entity.bottom > bbox.dx) entity.bottom = bbox.dx - entity.size.x;
	}
}
