import Trait from "./Trait.js";
export default class GravityTrait extends Trait {
	update({ dt }, entity, scene) {
		entity.vel.y += scene.gravity * entity.mass * dt;
	}
}
