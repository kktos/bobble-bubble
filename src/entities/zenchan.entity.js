import { DIRECTIONS } from "../script/types/direction.type.js";
import AnimationTrait from "../traits/animation.trait.js";
import KillIfOffscreenTrait from "../traits/killOffscreen.js";
import KillableTrait from "../traits/killable.trait.js";
import { PhysicsTrait } from "../traits/physics.trait.js";
import { SolidTrait } from "../traits/solid.trait.js";
import Entity from "./Entity.js";

export class ZenChanEntity extends Entity {
	constructor(resourceMgr, x, y, dir = DIRECTIONS.LEFT) {
		super(resourceMgr, x, y, "zen-chan");

		this.isFixed = false;

		this.dir = dir;

		const animTrait = new AnimationTrait();

		this.physicsTrait = new PhysicsTrait();
		this.addTrait(this.physicsTrait);

		this.solidTrait = new SolidTrait();
		this.addTrait(this.solidTrait);

		this.addTrait(new KillableTrait());
		this.addTrait(new KillIfOffscreenTrait());
		this.addTrait(animTrait);

		animTrait.setAnim(this, "zen-chan");
	}

	render({ viewport: { ctx } }) {
		this.spritesheet.draw(this.currSprite, ctx, this.left, this.top, {
			zoom: 1,
			flip: this.dir === DIRECTIONS.RIGHT ? 1 : 0,
		});
		ctx.strokeStyle = this.solidTrait.isColliding ? "red" : "blue";
		ctx.strokeRect(this.left, this.top, this.width, this.height);
		// ctx.strokeStyle = "green";
		// for (const collisionRect of this.physicsTrait.collisionRects) {
		// 	ctx.strokeRect(collisionRect.left, collisionRect.top, collisionRect.width, collisionRect.height);
		// }

		// ctx.fillStyle = "red";
		// ctx.fillText(`${this.physicsTrait.collisionRects.length}`,450,50);
	}
}
