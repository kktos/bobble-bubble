// import {createBricks} from "../utils/bricks.util.js";
import Layer from "./layer.js";

export default class EntitiesLayer extends Layer {
	static TASK_REMOVE_ENTITY= Symbol('removeEntity');
	static TASK_ADD_ENTITY= Symbol('addEntity');

	constructor(gc, parent, entities= [], sheet= null) {
		super(gc, parent);

		// if(sheet)
		// 	entities.push(...createBricks(gc, {bricksDef: sheet}));
		this.entities= entities;

		this.setTaskHandlers();
	}

	setTaskHandlers() {
		const scene= this.scene;

		scene.tasks
			.onTask(EntitiesLayer.TASK_REMOVE_ENTITY, (entity) => {
				const idx= this.entities.indexOf(entity);
				if(idx !== -1)
					this.entities.splice(idx, 1);			
			});

		scene.tasks
			.onTask(EntitiesLayer.TASK_ADD_ENTITY, (entity) => {
				this.entities.push(entity);
			});

	}

	update(gc, scene) {
		for (let idx = 0; idx < this.entities.length; idx++)
			this.entities[idx].update(gc);
	}

	render(gc) {
		for (let idx = 0; idx < this.entities.length; idx++)
			this.entities[idx].render(gc)
		
		const ctx= gc.viewport.ctx;
		ctx.fillStyle="#fff";
		ctx.font= "10px";
		ctx.fillText(`${this.entities.length}`,600-60,600-10);
	}

}