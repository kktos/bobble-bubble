import DisplayLayer from "../display.layer.js";

export default class Timers {

	static createTimers(sheet) {
		if(!sheet.timers)
			return null;

		const obj= new Timers();

		for (const [name, value] of Object.entries(sheet.timers)) {
			const duration= value.time/60;
			const repeatCount= value.repeat ? Number.POSITIVE_INFINITY : 0;
			obj.timers.set(name, {
				active: true,
				duration,
				repeatCount,
				countdown: duration,
				counter: repeatCount,
			});
		}

		return obj;
	}


	constructor() {
		this.timers= new Map();
	}

	stop(name) {
		if(this.timers.has(name))
			this.timers.get(name).active= false;
	}

	reset(name) {
		if(this.timers.has(name)) {
			const t= this.timers.get(name);
			t.countdown= t.duration;
			t.counter= t.repeatCount;
			t.active= true;
		}
	}

	start(name) {
		if(this.timers.has(name)) {
			const t= this.timers.get(name);
			t.active= true;
		}
	}

	update(gc, scene) {
		for (const [name, t] of this.timers) {
			if(!t.active)
				continue;
			t.countdown-= gc.deltaTime;
			if(t.countdown<=0) {
				t.countdown= t.duration;
				t.counter--;
				if(t.counter<=0)
					t.active= false;
				scene.events.emit(DisplayLayer.EVENT_TIME_OUT, name);
			}
		}		
	}
}