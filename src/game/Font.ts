import ENV from "../env";
import { nameToRgba } from "../utils/canvas.utils";
import { loadImage, loadJson } from "../utils/loaders.util";
import { SpriteSheet } from "./Spritesheet";

// const CHARS= ' 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ©!-×.';
export const Align = {
	Left: 1,
	Center: 2,
	Right: 3,
};

function loadFont(sheet) {
	return loadImage(sheet.img).then((image) => {
		const fontSprite = new SpriteSheet(image);
		const offsetX = sheet.offsetX | 0;
		const offsetY = sheet.offsetY | 0;
		const gapX = sheet.gapX | 0;
		const rowLen = image.width;
		for (const [index, char] of [...sheet.charset].entries()) {
			const x = offsetX + ((index * (sheet.width + gapX)) % rowLen);
			const y = offsetY + Math.floor((index * (sheet.width + gapX)) / rowLen) * sheet.width;
			fontSprite.define(char, x, y, sheet.width, sheet.height);
		}

		return new Font(sheet.name, fontSprite, sheet.height, sheet.width);
	});
}

export default class Font {
	public name: string;
	public size: number;
	public align: number;
	public spritesheet: SpriteSheet;

	private spriteHeight: number;
	private spriteWidth: number;
	private cache: Map<string, HTMLCanvasElement>;

	static async load(filename: string) {
		const sheet = await loadJson(ENV.FONTS_PATH + filename);
		return await loadFont(sheet);
	}

	constructor(name: string, sprites, height: number, width: number) {
		this.name = name;
		this.spritesheet = sprites;
		this.spriteHeight = height;
		this.spriteWidth = width;
		this.size = 1;
		this.align = Align.Left;
		this.cache = new Map();
	}

	get height() {
		return this.spriteHeight * this.size;
	}
	get width() {
		return this.spriteWidth * this.size;
	}

	textRect(text: string, x: number, y: number) {
		const textLen = String(text).toUpperCase().length;
		const width = textLen * this.width;
		let newX = x;
		switch (this.align) {
			case Align.Center:
				newX -= width / 2;
				break;
			case Align.Right:
				newX -= width;
				break;
		}
		return [newX, y, newX + width, y + this.height];
	}

	print(context: CanvasRenderingContext2D, text, x: number, y: number, color?: string) {
		if (text === undefined || text === null || text === "") return [x, y, x, y];

		const key = JSON.stringify([text, x, y, color]);
		if (!this.cache.has(key)) {
			const canvas = document.createElement("canvas");
			const str = String(text).toUpperCase();

			canvas.width = str.length * this.width;
			canvas.height = this.height;

			const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
			ctx.imageSmoothingEnabled = false;
			[...str].forEach((char, pos) => {
				this.spritesheet.draw(char, ctx, pos * this.width, 0, { flip: 0, zoom: this.size });
			});

			// if(color) {
			//     ctx.globalCompositeOperation= "source-in";
			//     ctx.fillStyle= color;
			//     ctx.fillRect(0, 0, canvas.width, canvas.height);
			// }

			if (color) {
				const [r, g, b, a = 255] = nameToRgba(color);
				const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
				const data = imageData.data;
				for (let i = 0; i < data.length; i += 4) {
					if (data[i] === 255 && data[i] === 255 && data[i + 2] === 255) {
						data[i] = r;
						data[i + 1] = g;
						data[i + 2] = b;
						data[i + 3] = a;
					}
				}
				ctx.putImageData(imageData, 0, 0);
			}

			this.cache.set(key, canvas);
		}

		const canvas = this.cache.get(key);
		if (!canvas) return [x, y, x, y];

		let newX = x;
		switch (this.align) {
			case Align.Center:
				newX -= canvas.width / 2;
				break;
			case Align.Right:
				newX -= canvas.width;
				break;
		}

		context.drawImage(canvas, newX, y);
		return [newX, y, newX + canvas.width, y + canvas.height];
	}
}
