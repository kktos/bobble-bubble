import { DisplayLayer } from "../display.layer.js";

class Timer {
	constructor(parent, name, duration, repeatCount) {
		this.parent = parent;
		this.name = name;
		this.duration = duration / 1000;
		this.repeatCount = repeatCount;
		this.countdown = this.duration;
		this.counter = repeatCount;
	}

	reset() {
		this.countdown = this.duration;
		this.counter = this.repeatCount;
		this.start();
	}

	stop() {
		this.parent.stop(this.name);
	}

	start() {
		this.parent.start(this.name);
	}
}

export class Timers {
	static createTimers(sheet) {
		if (typeof sheet?.timers !== "object") return null;

		const obj = new Timers();
		for (const [name, value] of Object.entries(sheet.timers)) {
			const repeatCount = value.repeat ?? 0;
			obj.stoppedTimers.set(name, new Timer(obj, name, value.time, repeatCount));
		}
		return obj;
	}

	constructor() {
		this.timers = new Map();
		this.stoppedTimers = new Map();
	}

	add(name, duration, repeatCount) {
		const t = new Timer(this, name, duration, repeatCount);
		this.stoppedTimers.set(name, t);
		return t;
	}

	get(name) {
		if (this.timers.has(name)) return this.timers.get(name);

		if (this.stoppedTimers.has(name)) return this.stoppedTimers.get(name);

		return null;
	}

	stop(name) {
		if (this.timers.has(name)) {
			this.stoppedTimers.set(name, this.timers.get(name));
			this.timers.delete(name);
		}
	}

	start(name) {
		if (this.timers.has(name)) return this.timers.get(name);

		if (this.stoppedTimers.has(name)) {
			const t = this.stoppedTimers.get(name);
			this.timers.set(name, t);
			this.stoppedTimers.delete(name);
			return t;
		}
		return null;
	}

	update(gc, scene) {
		for (const [name, t] of this.timers) {
			t.countdown -= gc.deltaTime;
			if (t.countdown <= 0) {
				scene.events.emit(DisplayLayer.EVENT_TIME_OUT, name);
				t.countdown = t.duration;
				t.counter--;
				if (t.counter <= 0) this.stop(name);
			}
		}
	}
}
