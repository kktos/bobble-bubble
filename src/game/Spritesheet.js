import ENV from "../env.js";
import { drawZoomedImage } from "../utils/canvas.utils.js";
import createSpriteSheet from "../utils/createSpriteSheet.util.js";
import { loadImage, loadJson } from "../utils/loaders.util.js";
import Anim from "./Anim.js";

export default class SpriteSheet {
	static load(filename) {
		let sheet;
		return loadJson(ENV.SPRITESHEETS_PATH + filename)
			.then((s) => {
				sheet = s;
			})
			.then(() => loadImage(sheet.img))
			.then((img) => createSpriteSheet(sheet, img));
	}

	constructor(img) {
		this.img = img;

		const canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;

		const ctx = canvas.getContext("2d");
		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(img, 0, 0);

		this.data = {
			imgData: ctx.getImageData(0, 0, img.width, img.height).data,
			width: img.width,
		};

		this.sprites = new Map();
		this.animations = new Map();
	}

	define(name, x, y, w, h, { scale = 1 } = {}) {
		const sprites = [false, true].map((flip) => {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			ctx.imageSmoothingEnabled = false;

			canvas.width = w * scale;
			canvas.height = h * scale;

			if (flip) {
				ctx.scale(-1, 1);
				ctx.translate(-w * scale, 0);
			}

			if (scale) {
				drawZoomedImage(this.data, ctx, scale, {
					x,
					y,
					w: canvas.width,
					h: canvas.height,
				});
			} else {
				ctx.drawImage(this.img, x, y, w, h, 0, 0, w, h);
			}

			return canvas;
		});
		this.sprites.set(name, sprites);
	}

	defineComplex(name, spriteDef) {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		ctx.imageSmoothingEnabled = false;

		{
			let width = 0;
			let height = 0;
			// spriteDef.forEach(([offsets, name]) => {
			for (let idx = 0; idx < spriteDef.length; idx++) {
				const [[col, row, countX, countY], name] = spriteDef[idx];
				// const [col, row, countX, countY]= offsets;
				if (name) {
					const s = this.spriteSize(name);
					if (countY) height += s.y * countY;
					if (countX) width += s.x * countX;
					if (width < s.x) width = s.x;
					if (height < s.y) height = s.y;
				} else {
					height += row;
					width += col;
				}
			}

			canvas.width = width;
			canvas.height = height;
		}

		let width = 0;
		let height = 0;
		let dx = 0;
		let dy = 0;

		// spriteDef.forEach(([offsets, name]) => {
		// 	const [col, row, countX, countY]= offsets;
		for (let idx = 0; idx < spriteDef.length; idx++) {
			const [[col, row, countX, countY], name] = spriteDef[idx];
			let s;
			if (name) {
				s = this.spriteSize(name);
				if (countY) {
					dy = height;
					height += s.y * countY;
				}
				if (countX) {
					dx = width;
					width += s.x * countX;
				}
				if (width < s.x) width = s.x;
				if (height < s.y) height = s.y;
			} else {
				height += row;
				width += col;
				continue;
			}

			if (countY > 1) {
				for (let idx = 0; idx < countY; idx++) {
					ctx.drawImage(this.sprites.get(name)[0], 0, 0, s.x, s.y, dx, dy, s.x, s.y);
					dy += s.y;
				}
			} else if (countX > 1) {
				for (let idx = 0; idx < countX; idx++) {
					ctx.drawImage(this.sprites.get(name)[0], 0, 0, s.x, s.y, dx, dy, s.x, s.y);
					dx += s.x;
				}
			} else ctx.drawImage(this.sprites.get(name)[0], 0, 0, s.x, s.y, dx, dy, s.x, s.y);
		}

		this.sprites.set(name, [canvas]);
	}

	defineAnim(name, sheet) {
		this.animations.set(name, new Anim(name, sheet));
	}

	has(name) {
		return this.sprites.has(name);
	}

	hasAnim(name) {
		return this.animations.has(name);
	}

	spriteSize(name) {
		if (!this.sprites.has(name)) {
			throw new Error(`Unable to find sprite "${name}"`);
		}
		const sprite = this.sprites.get(name)[0];
		return { x: sprite.width, y: sprite.height };
	}

	draw(name, ctx, x, y, { flip, zoom } = { flip: 0, zoom: 1 }) {
		if (!this.sprites.has(name)) throw new Error(`Unable to find sprite "${name}"`);

		// const sprite = this.sprites.get(name)[flip??0];

		const pair = this.sprites.get(name);
		const sprite = pair[flip | 0];

		ctx.drawImage(sprite, x, y, (zoom ?? 1) * sprite.width, zoom * sprite.height);
		// ctx.strokeStyle="red";
		// ctx.strokeRect(x,y, zoom*sprite.width, zoom*sprite.height);
	}

	drawAnim(name, ctx, x, y, distance, { zoom } = { zoom: 1 }) {
		const animation = this.animations.get(name);
		this.draw(animation.frame(distance), ctx, x, y, { zoom });
	}
}
