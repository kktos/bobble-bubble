import ENV from "../env.js";
import { compileScript } from "../script/compiler/compiler.js";
import { loadJson } from "../utils/loaders.util.js";
import LocalDB from "../utils/storage.util.js";
import DisplayScene from "./display.scene.js";
// import DebugScene from "./debug.scene.js";
// import EditorScene from "./editor.scene.js";
import GameScene from "./game.scene.js";
import LevelScene from "./level.scene.js";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export default class SceneFactory {
	static async load(gc, name) {
		let sheet = null;

		console.log(`SceneFactory.load "${name}"`);

		gc.wannaPauseOnBlur = true;

		sheet = LocalDB.loadResource(name);
		if (!sheet) {
			try {
				const scriptText = await loadJson(`${ENV.SCENES_PATH}${name}.script`);
				sheet = compileScript(scriptText);
			} catch (e) {
				console.error(e.message);
				sheet = await loadJson(`${ENV.SCENES_PATH}${name}.json`);
			}
		}

		// console.log("SceneFactory.load", JSON.stringify(sheet, undefined, 2), sheet);

		let scene;
		switch (sheet.type) {
			case "display":
				scene = new DisplayScene(gc, sheet.name, sheet);
				break;
			// case "debug":
			// 	scene= new DebugScene(gc, sheet.name, sheet);
			// 	break;
			// case "editor":
			// 	scene= new EditorScene(gc, sheet.name, sheet);
			// 	break;
			case "level":
				scene = new LevelScene(gc, sheet.name, sheet);
				break;
			case "game":
				scene = new GameScene(gc, sheet.name, sheet);
				break;
			default:
				throw new Error(`Uknown Scene type: ${sheet.type}`);
		}

		// scene.killOnExit= sheet.killOnExit ? true : false;
		gc.viewport.canvas.style.cursor = sheet.showCursor ? "default" : "none";

		return scene;
	}
}
