import { DIRECTIONS } from "../script/types/direction.type.js";
import Trait from "./Trait.js";

export class KeyboardPlayerOneTrait extends Trait {
	update(gc, entity, scene) {
		if (gc.keys.get("ArrowLeft")) {
			entity.vel.x = -150;
			entity.dir = DIRECTIONS.LEFT;
		}
		if (gc.keys.get("ArrowRight")) {
			entity.vel.x = 150;
			entity.dir = DIRECTIONS.RIGHT;
		}
	}
}
