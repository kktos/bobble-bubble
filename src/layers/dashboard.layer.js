// import WallEntity from "../entities/wall.entity.js";
import ENV from "../env.js";
import { Align } from "../game/Font.js";
// import Level from "../scene/level.scene.js";
// import PlayerTrait from "../traits/player.trait.js";
import { Layer } from "./Layer.js";

let flipflop = true;
export class DashboardLayer extends Layer {
	constructor(gc, parent) {
		super(gc, parent);

		const rezMgr = gc.resourceManager;

		this.width = gc.viewport.width;
		this.centerX = Math.floor(this.width / 2);
		this.spritesheet = rezMgr.get("sprite", "bubblun");

		const lifeSize = this.spritesheet.spriteSize("life");
		this.lifeY = ENV.VIEWPORT_HEIGHT - lifeSize.y * 2 - 6;
		this.lifeW = lifeSize.x;

		// this.walls= [];
		// this.walls.push(
		// 	new WallEntity(rezMgr, "wallTop", 0, ENV.WALL_TOP),
		// 	new WallEntity(rezMgr, "wallLeft", 2, ENV.WALL_TOP),
		// 	new WallEntity(rezMgr, "wallRight", 0, ENV.WALL_TOP)
		// );
		// this.walls[2].left= this.width - this.walls[2].size.x - 2;

		this.font = rezMgr.get("font", ENV.MAIN_FONT);

		// this.timer= 0;
	}

	render({ scene: { paddle, state, name }, tick, viewport: { ctx } }) {
		// const playerTrait= paddle?.traits.get(PlayerTrait);
		// const playerInfo= { highscore:playerTrait?.highscore??0, score:playerTrait?.score??0, lives:playerTrait?.lives??3 };
		const playerInfo = { highscore: 0, score: 0, lives: 3 };

		this.font.size = 3;
		this.font.align = Align.Center;
		this.font.print(ctx, "HIGH SCORE", this.centerX, 1, "red");
		this.font.print(ctx, playerInfo.highscore, this.centerX, 28);

		this.font.align = Align.Left;
		if (!(tick % 28)) flipflop = !flipflop;
		if (flipflop) this.font.print(ctx, "1UP", this.width / 8, 1, "red");
		this.font.print(ctx, playerInfo.score, this.width / 8, 28);

		for (let idx = 0; idx < playerInfo.lives; idx++)
			this.spritesheet.draw("life", ctx, 22 + idx * this.lifeW, this.lifeY, {
				zoom: 1,
			});

		// switch(state) {
		// 	case Level.STATE_STARTING: {
		// 		if(!this.timer)
		// 			this.timer= tick;
		// 		this.font.align= Align.Center;
		// 		this.font.print(ctx, name, this.width/2, 480);
		// 		if(tick - this.timer > 50)
		// 			this.font.print(ctx, "READY", this.width/2, 520);
		// 		break;
		// 	}
		// 	case Level.STATE_ENDING: {
		// 		this.font.align= Align.Center;
		// 		this.font.print(ctx, "GAME OVER", this.width/2, 400);
		// 	}
		// }
	}
}
