import { BubbleEntity } from "./entities/bubble.entity";
import { BubblunEntity } from "./entities/bubblun.entity";
import { ZenChanEntity } from "./entities/zenchan.entity";
import "./index.css";

import type { Entity } from "gamer2d/entities/Entity";
import Game from "gamer2d/game/Game";
import type { GameOptions } from "gamer2d/game/Game";

const canvas = document.getElementById("game");
if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
	throw new Error("No Canvas game element found !?!");
}

const options: GameOptions = {
	paths: {
		audiosheets: "sounds/",
		fonts: "fonts/",
		spritesheets: "spritesheets/",
		scenes: "scenes/",
	},
	audio: {
		volume: 50,
	},
	entities: [
		{ name: "zen-chan", className: "ZenChanEntity", classType: ZenChanEntity as unknown as Entity },
		{ name: "bubblun", className: "BubblunEntity", classType: BubblunEntity as unknown as Entity },
		{ name: "bubble", className: "BubbleEntity", classType: BubbleEntity as unknown as Entity },
	],
};

const game = new Game(canvas, options);
game.start("menu", "resources.json");
