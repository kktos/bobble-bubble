// import Entity from "../entities/Entity.js";
// import SpawnerEntity from "../entities/enemyspawner.entity.js";
import { ZenChanEntity  } from "../entities/zenchan.entity.js";
// import ENV from "../env.js";
// import Events from "../events/events.js";
import BackgroundLayer from "../layers/background.layer.js";
import DashboardLayer from "../layers/dashboard.layer.js";
import EntitiesLayer from "../layers/entities.layer.js";
import LevelLayer from "../layers/level.layer.js";
// import {COLLISION,collideRect } from "../math.js";
// import Trait from "../traits/Trait.js";
// import KillableTrait from "../traits/killable.trait.js";
// import PlayerTrait from "../traits/player.trait.js";
// import StickyTrait from "../traits/powerups/sticky.trait.js";
import Scene from "./Scene.js";

export default class LevelScene extends Scene {

	static STATE_STARTING= Symbol('starting');
	static STATE_RUNNING= Symbol('running');
	static STATE_ENDING= Symbol('ending');

	constructor(gc, name, {background, settings}) {
		super(gc, name);
		this.killOnExit= true;

		this.entities= [];

		// this.audio= gc.resourceManager.get("audio","level");
		this.state= LevelScene.STATE_STARTING;

		this.breakableCount= 0;
		this.gravity= 50;

		const enemy= new ZenChanEntity(gc.resourceManager, 300, 10);
		this.entities.push(enemy);

		// const spawner= new SpawnerEntity(gc.resourceManager, 300, 550);
		// this.entities.push(spawner);
	
		// const thing= new Entity(gc.resourceManager, 300, 100);
		// thing.size= {x:20,y:20};
		// this.entities.push(thing);

		this.addLayer(new BackgroundLayer(gc, this, background));
		this.addLayer(new LevelLayer(gc, this, settings));
		this.addLayer(new EntitiesLayer(gc, this, this.entities));
		this.addLayer(new DashboardLayer(gc, this));
	}

	init(gc) {
	}

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

	update(gc) {
		super.update(gc);

		// const entities= this.entities;
		// const movingOnes= entities.filter(entity => !entity.isFixed);

		// for (let idx = 0; idx < entities.length; idx++)
		// 	entities[idx].update(gc);

		// for (let idx = 0; idx < movingOnes.length; idx++)
		// 	this.collides(gc, movingOnes[idx]);

		// for (let idx = 0; idx < entities.length; idx++)
		// 	entities[idx].finalize();
	}

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
