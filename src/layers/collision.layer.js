import { Layer } from "./Layer.js";

export class CollisionLayer extends Layer {
	static TASK_REMOVE_ENTITY = Symbol("removeEntity");
	static TASK_ADD_ENTITY = Symbol("addEntity");

	constructor(gc, parent) {
		super(gc, parent);
		123;
	}

	update(gc, scene) {
		// for (const entity of this.entities) entity.update(gc, scene);
		// for (const entity of this.entities) entity.finalize();
	}

	render(gc) {
		// for (const entity of this.entities) entity.render(gc);
		// const ctx = gc.viewport.ctx;
		// ctx.fillStyle = "#fff";
		// ctx.font = "10px";
		// // ctx.fillText(`${this.entities.length}`, 600 - 60, 600 - 10);
		// ctx.fillText(`${this.entities.length}`, 500, 15);
	}
}
