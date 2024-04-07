export class Layer {
	constructor(gc, parent) {
		this.gc = gc;
		this.scene = parent;
	}

	init(gc, scene) {}
	update(gc, scene) {}
	render(dt) {}
}
