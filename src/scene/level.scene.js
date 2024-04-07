import { BackgroundLayer } from "../layers/background.layer.js";
import { CollisionLayer } from "../layers/collision.layer.js";
import { DashboardLayer } from "../layers/dashboard.layer.js";
import { EntitiesLayer } from "../layers/entities.layer.js";
import { LevelLayer } from "../layers/level.layer.js";
import { createLevelEntities } from "../utils/createLevelEntities.utils.js";
import { createLevelGrid } from "../utils/createLevelGrid.utils.js";
import { Scene } from "./Scene.js";

export default class LevelScene extends Scene {
	static STATE_STARTING = Symbol("starting");
	static STATE_RUNNING = Symbol("running");
	static STATE_ENDING = Symbol("ending");

	constructor(gc, name, sheet) {
		super(gc, name);
		this.killOnExit = true;

		// this.entities = [];

		// this.audio= gc.resourceManager.get("audio","level");
		this.state = LevelScene.STATE_STARTING;

		this.gravity = 50;

		this.grid = createLevelGrid(sheet.settings);

		this.entities = createLevelEntities(gc.resourceManager, this.grid, sheet.sprites);

		// const spawner= new SpawnerEntity(gc.resourceManager, 300, 550);
		// this.entities.push(spawner);

		this.addLayer(new BackgroundLayer(gc, this, sheet.background));
		this.addLayer(new LevelLayer(gc, this, sheet.name, sheet.settings, this.grid));
		this.addLayer(new EntitiesLayer(gc, this, this.entities));
		this.addLayer(new CollisionLayer(gc, this));
		this.addLayer(new DashboardLayer(gc, this));
	}

	init(gc) {}

	broadcast(name, ...args) {
		for (let idx = 0; idx < this.entities.length; idx++) {
			this.entities[idx].emit(name, ...args);
		}
	}

	// collides(gc, target) {
	// 	for (let idx = 0; idx < this.entities.length; idx++) {
	// 		const entity= this.entities[idx];

	// 		if(target === entity)
	// 			continue;

	// 		// if(target.class === "BallEntity")
	// 		// 	console.log("Level.collides", this.entities.length, idx, entity.class, entity.size, target.size);

	// 		if(!(entity.size.x + entity.size.y) || !(target.size.x + target.size.y))
	// 			continue;

	// 		let side= collideRect(entity, target);

	// 		if(side !== COLLISION.NONE) {
	// 			target.collides(gc, side, entity);
	// 			if(!entity.isFixed)
	// 				continue;
	// 			switch(side) {
	// 				case COLLISION.LEFT:
	// 					side= COLLISION.RIGHT;
	// 					break;

	// 				case COLLISION.RIGHT:
	// 					side= COLLISION.LEFT;
	// 					break;

	// 				case COLLISION.TOP:
	// 					side= COLLISION.BOTTOM;
	// 					break;

	// 				case COLLISION.BOTTOM:
	// 					side= COLLISION.TOP;
	// 					break;
	// 			}
	// 			entity.collides(gc, side, target);
	// 		}
	// 	}

	// }

	// update(gc) {
	// 	super.update(gc);

	// 	for (const entity of this.entities)
	// 		entity.finalize();

	// }

	handleEvent(gc, e) {
		// switch(e.type) {
		// 	case "keydown": {
		// 		switch(e.key) {
		// 			case "r":
		// 				this.reset(gc);
		// 				break;
		// 			case "n":
		// 				this.events.emit(Scene.EVENT_COMPLETE, -1);
		// 				break;
		// 		}
		// 		break;
		// 	}
		// 	case "click": {
		// 		this.paddle.emit(Events.EVENT_MOUSECLICK, gc, this.paddle.pos);
		// 		break;
		// 	}
		// }
	}
}
