import Trait from "./Trait.js";
import KillableTrait from "./killable.trait.js";

export default class KillIfOffscreenTrait extends Trait {
	update(gc, entity, scene) {
		if (scene.bbox.left <= entity.left && entity.left <= scene.bbox.right && entity.top <= scene.bbox.bottom) return;
		if (entity.traits.has(KillableTrait)) entity.traits.get(KillableTrait).kill();
	}
}
