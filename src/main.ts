import "./index.css";

const canvas = document.getElementById("game");
if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
	throw new Error("No Canvas game element found !?!");
}

// import Game from "./game/Game";
import Game from "../../gamer2D/dist/gamer2d";
const game = new Game(canvas);
game.start("menu","resources.json");
