
import BubbleEntity from "../../../entities/bubble.entity.js";
import { entityClasses } from "../../../entities/entities.js";
import Scene from "../../../scene/Scene.js";
import LocalDB from "../../../utils/storage.util.js";
import EntitiesLayer from "../../entities.layer.js";

export class System {

	constructor({gc, vars, layer}) {
		this.gc= gc;
		this.vars= vars;
		this.layer= layer;
	}

	goto(sceneName) {
		this.gc.scene.events.emit(Scene.EVENT_COMPLETE, sceneName);
	}
	
	updateHighscores(playerName) {
		if(playerName) {
			LocalDB.updateName(playerName);
			LocalDB.updateHighscores();
		}
	}
	
	concat(str, maxLen) {
		let value= this.vars.get(str);
		const text = this.vars.get("itemSelected").text;
		if(maxLen) {
			if(value.length >= maxLen)
				value= "";
			value += text;
			value= value.substr(0, maxLen);
		}
		else
			value+= text;
		this.vars.set(str, value);

	}

	spawn(name, x , y, anim) {
		if(entityClasses[name]) {
			const entity= new entityClasses[name](this.gc.resourceManager, x, y);
			this.layer.scene.addTask(EntitiesLayer.TASK_ADD_ENTITY, entity);
		}
	}

	timerStop(name) {
		this.layer.timers.stop(name);
	}
}
