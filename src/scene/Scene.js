import EventEmitter from "../events/EventEmitter.js";
import TaskList from "../game/TaskList.js";

export class Scene {
	static EVENT_COMPLETE = Symbol("scene complete");
	static EVENT_START = "SCENE_START";
	static TASK_RESET = Symbol("reset");

	constructor(gc, name) {
		const m = String(this.constructor).match(/class ([a-zA-Z0-9_]+)/);
		this.class = m?.[1];

		this.gc = gc;
		this.name = name;

		this.screenWidth = gc.viewport.width;
		this.screenHeight = gc.viewport.height;
		this.bbox = {
			left: 0,
			top: 0,
			right: this.screenWidth,
			bottom: this.screenHeight,
		};

		this.events = new EventEmitter();
		this.layers = [];
		this.receiver = null;
		this.isRunning = false;
		this.killOnExit = true;
		this.next = null;

		this.tasks = new TaskList();
		this.setTaskHandlers(gc);
	}

	init(gc) {
		for (let idx = 0; idx < this.layers.length; idx++) this.layers[idx].init?.(gc, this);
	}

	addLayer(layer) {
		this.layers.push(layer);
	}

	update(gc) {
		for (const layer of this.layers) layer.update(gc, this);
		this.tasks.processTasks();
	}

	render(gc) {
		for (const layer of this.layers) layer.render(gc, this);
	}

	pause() {
		this.isRunning = false;
	}
	run() {
		this.isRunning = true;
		this.gc.scene = this;
		this.events.emit(Scene.EVENT_START, this.name);
	}

	handleEvent(gc, e) {
		if (this.receiver) this.receiver.handleEvent(gc, e);
	}

	addTask(name, ...args) {
		this.tasks.addTask(name, ...args);
	}

	setTaskHandlers(gc) {
		// this.tasks.onTask(Scene.TASK_RESET, () => {
		// 	this.reset(gc);
		// });
	}
}
