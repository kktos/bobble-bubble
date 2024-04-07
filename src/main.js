import "./index.css";
// import "./utils/console.util.js";

// console.hide();

const canvas = document.getElementById("game");
if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
	throw new Error("No Canvas game element found !?!");
}

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

try {
	import(
		/* webpackPrefetch: true */
		"./game/Game.js"
	)
		.then((m) => m.default)
		.then((Game) => {
			const game = new Game(canvas);
			game.start();
		})
		.catch((err) => console.error("IMPORT", err));
} catch (e) {
	console.error("EXCEPTION");
	console.error(e);
}
