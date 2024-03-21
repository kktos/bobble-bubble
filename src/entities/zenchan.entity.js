
import { getRandom } from "../math.js";
import AnimationTrait from "../traits/animation.trait.js";
import GravityTrait from "../traits/gravity.trait.js";
import KillIfOffscreenTrait from "../traits/killOffscreen.js";
// import FollowPathTrait from "../traits/followPath.trait.js";
import KillableTrait from "../traits/killable.trait.js";
import VelocityTrait from "../traits/velocity.trait.js";
import Entity from "./Entity.js";

export class ZenChanEntity extends Entity {

	constructor(resourceMgr, x, y) {
		super(resourceMgr, x, y, "zen-chan");

		this.isFixed= false;

		const animTrait= new AnimationTrait();
		
		this.addTrait(new GravityTrait());
		this.addTrait(new VelocityTrait());
		this.addTrait(new KillableTrait());
		this.addTrait(new KillIfOffscreenTrait());
		this.addTrait(animTrait);
		// this.addTrait(new FollowPathTrait());
		
		animTrait.setAnim(this, "zen-chan");
	}

	render({viewport:{ctx}}) {
		this.spritesheet.draw(this.currSprite, ctx, this.left, this.top, {zoom: 2});
		// this.spritesheet.drawAnim(this.currSprite, ctx, this.pos.x, this.pos.y, this.lifetime);
		// ctx.fillText(`${this.vel.x} ${this.vel.y}`,300,600-20);
	}	
}