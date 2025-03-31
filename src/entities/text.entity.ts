import ENV from "../env";
import type Font from "../game/Font";
import type ResourceManager from "../game/ResourceManager";
import FadeTrait from "../traits/fade.trait";
import { Entity } from "./Entity";

export default class TextEntity extends Entity {
	font: Font;
	text: () => string;
	color: string;
	align: number;
	fontsize: number;

	constructor(resourceMgr: ResourceManager, textObj) {
		super(resourceMgr, textObj.pos[0], textObj.pos[1]);

		this.font = resourceMgr.get("font", ENV.MAIN_FONT) as Font;

		this.text = typeof textObj.text !== "function" ? () => textObj.text : textObj.text;
		this.color = textObj.color;
		this.align = textObj.align;
		this.fontsize = textObj.size;

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
		this.font.size = this.fontsize;
		this.font.align = this.align;
		this.font.print(ctx, this.text(), this.left, this.top, this.color);
	}
}
