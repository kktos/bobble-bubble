import { Layer } from "./Layer.js";

export class EntitiesLayer extends Layer {
	static TASK_REMOVE_ENTITY = Symbol("removeEntity");
	static TASK_ADD_ENTITY = Symbol("addEntity");

	constructor(gc, parent, entities = [], sheet = null) {
		super(gc, parent);

		// if(sheet)
		// 	entities.push(...createBricks(gc, {bricksDef: sheet}));
		this.entities = entities;

		this.setTaskHandlers();
	}

	setTaskHandlers() {
		const tasks = this.scene.tasks;

		tasks.onTask(EntitiesLayer.TASK_REMOVE_ENTITY, (entity) => {
			const idx = this.entities.indexOf(entity);
			if (idx !== -1) this.entities.splice(idx, 1);
		});

		tasks.onTask(EntitiesLayer.TASK_ADD_ENTITY, (entity) => {
			this.entities.push(entity);
		});
	}

	update(gc, scene) {
		for (const entity of this.entities) entity.update(gc, scene);
		for (const entity of this.entities) entity.finalize();
	}

	render(gc, scene) {
		for (const entity of this.entities) entity.render(gc, scene);

		const ctx = gc.viewport.ctx;
		ctx.fillStyle = "#fff";
		ctx.font = "10px";
		// ctx.fillText(`${this.entities.length}`, 600 - 60, 600 - 10);
		ctx.fillText(`${this.entities.length}`, 500, 15);
	}
}
