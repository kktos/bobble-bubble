export class Grid {
	constructor(x, y, w, h) {
		this.grid = [];
		this.baseX = x;
		this.baseY = y;
		this.cellHeight = w;
		this.cellWidth = h;
	}

	forEach(callback) {
		this.grid.forEach((column, x) => {
			column.forEach((value, y) => {
				callback(value, x, y);
			});
		});
	}

	delete(x, y) {
		const col = this.grid[x];
		if (col) {
			delete col[y];
		}
	}

	get(x, y) {
		const col = this.grid[x];
		if (col) {
			return col[y];
		}
		return undefined;
	}

	set(x, y, value) {
		if (!this.grid[x]) {
			this.grid[x] = [];
		}

		this.grid[x][y] = value;
	}

	toCoord(x, y) {
		return { x: this.baseX + x * this.cellWidth, y: this.baseY + y * this.cellHeight };
	}

	toGrid(x, y) {
		return { x: Math.floor((x - this.baseX) / this.cellWidth), y: Math.floor((y - this.baseY) / this.cellHeight) };
	}
}
