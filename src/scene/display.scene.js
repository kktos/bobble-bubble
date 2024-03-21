import BackgroundLayer from "../layers/background.layer.js";
import DisplayLayer from "../layers/display.layer.js";
import { layerClasses } from "../layers/layers.js";
import Scene from "./Scene.js";

let t0;

export default class DisplayScene extends Scene {

	constructor(gc, name, sheet) {
		super(gc, name);

		this.addLayer(new BackgroundLayer(gc, this, sheet.background));

		if(sheet.layers) {
			for (let idx = 0; idx < sheet.layers.length; idx++) {
				const layerName = sheet.layers[idx];
				if(!layers[layerName])
					throw new TypeError(`Unknown Layer ${layerName}`);

				this.addLayer( new layerClasses[layerName](gc, this) );
			}
		}

		this.receiver= new DisplayLayer(gc, this, sheet);
		this.addLayer(this.receiver);
	}

}
