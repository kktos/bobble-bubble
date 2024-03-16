
export default class Layer {
	
	// biome-ignore lint/complexity/noUselessConstructor: <explanation>
	constructor(gc, parent) {
		this.gc= gc;
		this.scene= parent;
	}	
	
	init(gc, scene) {}
	update(gc, scene) {}
	render(dt) {}
}