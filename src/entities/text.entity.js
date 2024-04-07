import ENV from "../env.js";
import { FadeTrait } from "../traits/fade.trait.js";
import Entity from "./Entity.js";

export default class TextEntity extends Entity {
	constructor(resourceMgr, textObj) {
		super(resourceMgr, textObj.pos[0], textObj.pos[1]);

		this.font = resourceMgr.get("font", ENV.MAIN_FONT);

		this.text = typeof textObj.text !== "function" ? () => textObj.text : textObj.text;
		this.color = textObj.color;
		this.align = textObj.align;
		this.size = textObj.size;

		switch (textObj.anim?.name) {
			case "fadein":
				this.addTrait(new FadeTrait("in", this.color));
				this.color = "#000";
				break;
			case "fadeout":
				this.addTrait(new FadeTrait("out", this.color));
		}
	}

	render(gc) {
		const ctx = gc.viewport.ctx;
		this.font.size = this.size;
		this.font.align = this.align;
		this.font.print(ctx, this.text(), this.left, this.top, this.color);
	}
}
