import { Entity } from "gamer2d/entities/Entity";
import { DIRECTIONS } from "gamer2d/script/types/direction.type";
import AnimationTrait from "gamer2d/traits/animation.trait";
import { KeyboardPlayerOneTrait } from "gamer2d/traits/kbd_player1.trait";
import { MoveTrait } from "gamer2d/traits/move.trait";
import { PhysicsTrait } from "gamer2d/traits/physics.trait";
import { SolidTrait } from "gamer2d/traits/solid.trait";

export class BubblunEntity extends Entity {
	private physicsTrait: PhysicsTrait;
	private solidTrait: SolidTrait;

	constructor(resourceMgr, x: number, y: number, dir = DIRECTIONS.LEFT) {
		super(resourceMgr, x, y, "bubblun");

		this.isFixed = false;
		this.dir = dir;

		const animTrait = new AnimationTrait();

		// this.addTrait(new MouseXYTrait());
		this.addTrait(new KeyboardPlayerOneTrait());

		this.addTrait(new MoveTrait());

		this.physicsTrait = new PhysicsTrait();
		this.addTrait(this.physicsTrait);

		this.solidTrait = new SolidTrait();
		this.addTrait(this.solidTrait);

		// this.addTrait(new KillableTrait());
		// this.addTrait(new KillIfOffscreenTrait());
		this.addTrait(animTrait);

		animTrait.setAnim(this, "bubblun");
	}

	render({ viewport: { ctx } }) {
		if (this.currSprite)
			this.spritesheet?.draw(this.currSprite, ctx, this.left, this.top, {
				zoom: 1,
				flip: this.dir === DIRECTIONS.RIGHT ? 1 : 0,
			});
		ctx.strokeStyle = this.solidTrait.isColliding ? "red" : "blue";
		ctx.strokeRect(this.left, this.top, this.width, this.height);
	}
}
