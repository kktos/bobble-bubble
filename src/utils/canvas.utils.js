import ENV from "../env.js";

export function createViewport(canvas) {
	canvas.width = window.innerWidth;
	canvas.height = canvas.width * ENV.VIEWPORT_RATIO;

	return {
		width: ENV.VIEWPORT_WIDTH,
		height: ENV.VIEWPORT_HEIGHT,
		canvas,
		bbox: canvas.getBoundingClientRect(),
		ctx: canvas.getContext("2d"),
		ratioWidth: canvas.width / ENV.VIEWPORT_WIDTH,
		ratioHeight: canvas.height / ENV.VIEWPORT_HEIGHT,
	};
}

const idataById = {};
let lastImageId = 0;
export function drawPixelated(img, context, zoom, x = 0, y = 0) {
	// if (!zoom) zoom=4; if (!x) x=0; if (!y) y=0;

	try {
		if (!img.id) img.id = `__img${lastImageId++}`;
	} catch (e) {
		console.log(e, img);
	}

	let idata = idataById[img.id];
	if (!idata) {
		const canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		const ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);
		idata = idataById[img.id] = ctx.getImageData(0, 0, img.width, img.height).data;
	}
	for (let x2 = 0; x2 < img.width; ++x2) {
		for (let y2 = 0; y2 < img.height; ++y2) {
			const i = (y2 * img.width + x2) * 4;
			const r = idata[i];
			const g = idata[i + 1];
			const b = idata[i + 2];
			const a = idata[i + 3];
			context.fillStyle = `rgba(${r},${g},${b},${a / 255})`;
			context.fillRect(x + x2 * zoom, y + y2 * zoom, zoom, zoom);
		}
	}
}

export function drawCropPixelated(img, context, zoom, srcRect, dstRect) {
	if (!img.id) img.id = `__img${lastImageId++}`;

	let idata = idataById[img.id];
	if (!idata) {
		const canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		const ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);
		idata = idataById[img.id] = ctx.getImageData(srcRect.x, srcRect.y, srcRect.w, srcRect.h).data;
	}
	for (let x2 = 0; x2 < img.width; ++x2) {
		for (let y2 = 0; y2 < img.height; ++y2) {
			const i = (y2 * img.width + x2) * 4;
			const r = idata[i];
			const g = idata[i + 1];
			const b = idata[i + 2];
			const a = idata[i + 3];
			context.fillStyle = `rgba(${r},${g},${b},${a / 255})`;
			context.fillRect(dstRect.x + x2 * zoom, dstRect.y + y2 * zoom, zoom, zoom);
		}
	}
}

export function drawZoomedImage({ imgData, width }, ctx, zoom, srcRect, x = 0, y = 0) {
	for (let x2 = 0; x2 < srcRect.w; ++x2) {
		for (let y2 = 0; y2 < srcRect.h; ++y2) {
			const i = ((y2 + srcRect.y) * width + (x2 + srcRect.x)) * 4;
			const r = imgData[i];
			const g = imgData[i + 1];
			const b = imgData[i + 2];
			const a = imgData[i + 3];
			ctx.fillStyle = `rgba(${r},${g},${b},${a / 255})`;
			ctx.fillRect(x + x2 * zoom, y + y2 * zoom, zoom, zoom);
		}
	}
}

export function createImgCanvas(img) {
	const canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0);
	return canvas;
}

export function createFromSource(srcCtx, x, y, w, h) {
	const imgData = srcCtx.getImageData(x, y, w, h);
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	canvas.width = w;
	canvas.height = h;
	ctx.putImageData(imgData, 0, 0);
	return canvas;
}

export function hexToRgb(hex) {
	return hex
		.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => `#${r}${r}${g}${g}${b}${b}`)
		.substring(1)
		.match(/.{2}/g)
		.map((x) => Number.parseInt(x, 16));
}

export function nameToRgba(name) {
	// get RGB from named color in div
	const fakeDiv = document.createElement("div");
	fakeDiv.style.color = name;
	document.body.appendChild(fakeDiv);

	const cs = window.getComputedStyle(fakeDiv);
	const pv = cs.getPropertyValue("color");

	document.body.removeChild(fakeDiv);

	const m = pv.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,?\s*(\d+\.\d*)?/);
	if (!m) throw new Error(`Error with color ${name} => ${pv}`);

	return [m[1], m[2], m[3], Math.floor((m[4] ?? 1) * 255)];
}
