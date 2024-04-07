import Trait from "./Trait.js";
export default class VelocityTrait extends Trait {
	update({ dt }, entity) {
		if (entity.isFixed) return;
		entity.left += entity.vel.x * dt;
		entity.top += entity.vel.y * dt;
	}
}
