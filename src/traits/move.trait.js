import Trait from "./Trait.js";

export class MoveTrait extends Trait {
	constructor() {
		super();
		this.deceleration = 400;
	}

	update({ dt }, entity, scene) {
		if (entity.vel.x !== 0) {
			const absX = Math.abs(entity.vel.x);
			const decel = Math.min(absX, this.deceleration * dt);
			entity.vel.x += entity.vel.x > 0 ? -decel : decel;
		}
	}
}
