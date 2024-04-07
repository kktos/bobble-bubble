import ENV from "../env.js";
import { createLevelImage } from "../utils/createLevelImage.utils.js";
import { Layer } from "./Layer.js";

export class LevelLayer extends Layer {
	constructor(gc, parent, name, settings, grid) {
		super(gc, parent);

		this.levelImage = createLevelImage(gc.resourceManager, grid, name, settings);
	}

	render({ viewport: { ctx } }) {
		ctx.drawImage(this.levelImage, ENV.LEVEL_GRID.X, ENV.LEVEL_GRID.Y);
	}
}
