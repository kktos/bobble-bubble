import { EntityPool } from "../../../entities/EntityPool.js";
import { entityClasses } from "../../../entities/entities.js";
import { Scene } from "../../../scene/Scene.js";
import LocalDB from "../../../utils/storage.util.js";
import { EntitiesLayer } from "../../entities.layer.js";

export class System {
	constructor({ gc, vars, layer }) {
		this.gc = gc;
		this.vars = vars;
		this.layer = layer;

		this.vars.set("SYSTEM", this);

		this.vars.set("EntityPool", {
			create: (name, size, ...args) => {
				const pool = EntityPool.create(gc.resourceManager, name, size, ...args);
				this.layer.scene.addTask(EntitiesLayer.TASK_ADD_ENTITY, pool);
			},
			spawn: (name, ...args) => {
				EntityPool.pools[name].get();
			},
		});
	}

	goto(sceneName) {
		this.gc.scene.events.emit(Scene.EVENT_COMPLETE, sceneName);
	}

	updateHighscores(playerName) {
		if (playerName) {
			LocalDB.updateName(playerName);
			LocalDB.updateHighscores();
		}
	}

	concat(str, maxLen) {
		let value = this.vars.get(str);
		const text = this.vars.get("itemSelected").text;
		if (maxLen) {
			if (value.length >= maxLen) value = "";
			value += text;
			value = value.substr(0, maxLen);
		} else value += text;
		this.vars.set(str, value);
	}

	spawn(name, ...args) {
		if (entityClasses[name]) {
			const entity = new entityClasses[name](this.gc.resourceManager, ...args);
			this.layer.scene.addTask(EntitiesLayer.TASK_ADD_ENTITY, entity);
		}
	}

	timer(name) {
		return this.layer.timers.get(name);
	}

	sprite(idxOrName) {
		return this.vars.get("sprites").get(idxOrName);
	}

	sound(name) {
		return this.vars.get("sounds").get(name);
	}
}
