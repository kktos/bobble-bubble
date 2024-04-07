import { Layer } from "./Layer.js";

export class BackgroundLayer extends Layer {
	constructor(gc, parent, color) {
		super(gc, parent);
		this.color = color;
	}

	render({ viewport: { ctx, width, height } }) {
		ctx.fillStyle = this.color;
		ctx.fillRect(0, 0, width, height);
	}
}
