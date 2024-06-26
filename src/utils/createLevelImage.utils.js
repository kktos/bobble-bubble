import ENV from "../env.js";

export function createLevelImage(resourceManager, grid, name, settings) {
	const spritesheet = resourceManager.get("sprite", "level-tiles");
	const levelNumber = Number(name);

	const canvas = document.createElement("canvas");
	canvas.width = ENV.LEVEL_GRID.CELL_WIDTH * ENV.LEVEL_GRID.COL;
	canvas.height = ENV.LEVEL_GRID.CELL_HEIGHT * ENV.LEVEL_GRID.ROW;

	const ctx = canvas.getContext("2d");
	ctx.translate(-ENV.LEVEL_GRID.X, -ENV.LEVEL_GRID.Y);

	grid.forEach((cell, x, y) => {
		switch (cell.kind) {
			case "[": {
				const isFirstOfTwo = "[*".includes(grid.get(x + 1, y)?.kind);
				if (isFirstOfTwo) {
					spritesheet.draw(settings.big, ctx, cell.r.x, cell.r.y);
					break;
				}
				const isSecondOfTwo = "[*".includes(grid.get(x - 1, y)?.kind);
				if (isSecondOfTwo) {
					ctx.fillStyle = settings.colorDark;
					ctx.fillRect(cell.r.x + cell.r.w, cell.r.y, 5, cell.r.h + 1);
				}
				break;
			}
			case "]":
				spritesheet.draw(settings.big, ctx, cell.r.x, cell.r.y);
				break;

			case "-": {
				spritesheet.draw(settings.small, ctx, cell.r.x, cell.r.y);

				const isFirstOfKind = grid.get(x - 1, y)?.kind !== "-";
				const offsetLeft = isFirstOfKind ? 5 : 0;
				const isLastOFKind = grid.get(x + 1, y)?.kind !== "-";
				const offsetRight = isLastOFKind ? 5 : 0;

				const top = cell.r.y + cell.r.h;
				const right = cell.r.x + cell.r.w;

				ctx.beginPath();
				ctx.moveTo(cell.r.x, top);
				ctx.lineTo(cell.r.x + offsetLeft, top + 5);
				ctx.lineTo(right + 1 + offsetRight, top + 5);
				ctx.lineTo(right + 1, top);
				ctx.fillStyle = settings.colorLight;
				ctx.fill();

				if (isLastOFKind) {
					const left = right;
					const top = cell.r.y - 1;
					const bottom = top + cell.r.h;
					ctx.beginPath();
					ctx.moveTo(left, top);
					ctx.lineTo(left + 5, top + 5);
					ctx.lineTo(left + 5, bottom + 5);
					ctx.lineTo(left, bottom);
					ctx.fillStyle = settings.colorDark;
					ctx.fill();
				}

				break;
			}

			case "_":
				spritesheet.draw(settings.small, ctx, cell.r.x, cell.r.y);
				break;
		}

		// ctx.strokeStyle = "white";
		// ctx.strokeRect(cell.r.x, cell.r.y, 16, 16);
	});

	ctx.translate(ENV.LEVEL_GRID.X, ENV.LEVEL_GRID.Y);

	// const cellWidth = bigBlockSize.x/2;
	// const cellHeight = bigBlockSize.y/2;
	// ctx.strokeStyle = "white";
	// for (let col = 0; col < ENV.LEVEL_GRID.COL; col++) {
	// 	for (let row = 0; row < ENV.LEVEL_GRID.ROW; row++) {
	// 		ctx.strokeRect(col*cellWidth, row*cellHeight, cellWidth, cellHeight);
	// 	}
	// }

	const font = resourceManager.get("font", "level-numbers");
	font.size = 2;
	font.print(ctx, levelNumber, 12, 4, settings.fontColor);

	return canvas;
}
