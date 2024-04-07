import { hexToRgb } from "../utils/canvas.utils.js";
import Trait from "./Trait.js";

export class FadeTrait extends Trait {
	constructor(inOrOut, color) {
		super();
		this.color = hexToRgb(color);
		this.isFadein = inOrOut === "in";
		this.alpha = this.isFadein ? 0 : 255;
		this.isRunning = true;
	}

	update({ dt }, entity) {
		if (!this.isRunning) return;
		this.alpha = this.alpha + (this.isFadein ? 1 : -1) * dt * 60;
		if (this.alpha > 255 || this.alpha < 1) {
			this.isRunning = false;
			return;
		}
		entity.color = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.alpha / 255})`;
	}
}
