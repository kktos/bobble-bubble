import { Entity } from "gamer2d/entities/Entity";
import type ResourceManager from "gamer2d/game/ResourceManager";
import { getRandom } from "gamer2d/maths/math";
import AnimationTrait from "gamer2d/traits/animation.trait";
import { KillIfOffscreenTrait } from "gamer2d/traits/killOffscreen.trait";
import { KillableTrait } from "gamer2d/traits/killable.trait";
import VelocityTrait from "gamer2d/traits/velocity.trait";

export class BubbleEntity extends Entity {
	constructor(resourceMgr: ResourceManager, x: number, y: number) {
		super(resourceMgr, x, y, "misc");

		this.isFixed = false;
		this.vel = { x: getRandom(10, 100), y: getRandom(10, 100) };

		this.vel.x = getRandom(0, 1) > 0.5 ? this.vel.x : -this.vel.x;
		this.vel.y = getRandom(0, 1) > 0.5 ? this.vel.y : -this.vel.y;

		const animTrait = new AnimationTrait();

		this.addTrait(new VelocityTrait());
		this.addTrait(new KillableTrait());
		this.addTrait(new KillIfOffscreenTrait());
		this.addTrait(animTrait);
		// this.addTrait(new FollowPathTrait());

		animTrait.setAnim(this, "bubble");
	}

	render({ viewport: { ctx } }) {
		if (this.currSprite) this.spritesheet?.draw(this.currSprite, ctx, this.left, this.top);
		// this.spritesheet.drawAnim(this.currSprite, ctx, this.pos.x, this.pos.y, this.lifetime);
		// ctx.fillText(`${this.vel.x} ${this.vel.y}`,300,600-20);
	}
}
