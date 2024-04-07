import AnimationTrait from "../traits/animation.trait.js";
import Entity from "./Entity.js";

export default class SpriteEntity extends Entity {
	constructor(resourceMgr, x, y, sprite) {
		const [sheet, spriteName] = sprite.split(":");

		super(resourceMgr, x, y, sheet);
		this.size = { x: 50, y: 50 };

		// this.isFixed = false;

		this.isAnimSprite = spriteName.match(/^@/);
		if (this.isAnimSprite) {
			this.addTrait(new AnimationTrait()).setAnim(this, spriteName.substring(1));
		} else {
			this.setSprite(spriteName);
		}
	}

	render(gc) {
		const ctx = gc.viewport.ctx;
		this.spritesheet.draw(this.currSprite, ctx, this.left, this.top);
	}
}
