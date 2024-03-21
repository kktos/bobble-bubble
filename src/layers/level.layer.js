import Layer from "./layer.js";

export default class LevelLayer extends Layer {

	constructor(gc, parent, settings) {
		super(gc, parent);

		const rezMgr= gc.resourceManager;
		this.spritesheet= rezMgr.get("sprite", "level-tiles");

		this.font= rezMgr.get("font", "level-numbers");

		this.levelNumber= "1";
		this.level= settings.template;
		this.shadowColors= [settings.colorLight, settings.colorDark];
		this.blocks= [settings.small, settings.big];
		this.fontColor= settings.fontColor;

		this.smallBlockSize= this.spritesheet.spriteSize(settings.small);
		this.bigBlockSize= this.spritesheet.spriteSize(settings.big);

		this.rowHeight= this.bigBlockSize.y;
		this.halfRowHeight= Math.floor(this.bigBlockSize.y/2);


		this.levelImage= this.buildLevelImage();
	}

	buildLevelImage() {
		const canvas= document.createElement('canvas');
		const ctx= canvas.getContext('2d');

		canvas.width= this.bigBlockSize.x*this.level[0].length;
		canvas.height= this.rowHeight*this.level.length;

		let colWidth;
		let yPos= 0;
		let previous= null;
		for (let rowIdx = 0; rowIdx < this.level.length; rowIdx++) {
			const row = this.level[rowIdx];
			let xPos= 0;
			for (let colIdx = 0; colIdx < row.length; colIdx++) {
				switch(row[colIdx]) {
					case "[":
						colWidth= this.bigBlockSize.x;
						ctx.fillStyle= this.shadowColors[1];
						ctx.fillRect(xPos+colWidth, yPos, 5, this.rowHeight+1);
						this.spritesheet.draw(this.blocks[1], ctx, xPos, yPos);
						break;
					case "]":
						colWidth= this.bigBlockSize.x;
						this.spritesheet.draw(this.blocks[1], ctx, xPos, yPos);
						break;
					case "-": {
						colWidth= this.smallBlockSize.x;

						const isLast= row[colIdx+1] !== "-";

						const right= xPos+colWidth;
						const top= yPos+this.halfRowHeight;
						const offsetLeft= previous!=="-" ? 5 : 0;
						const offsetRight= isLast ? 5 : 0;
						ctx.beginPath();
						ctx.moveTo(xPos, top);
						ctx.lineTo(xPos+offsetLeft, top+5);
						ctx.lineTo(right+1+offsetRight, top+5);
						ctx.lineTo(right+1, top);
						ctx.fillStyle= this.shadowColors[0];
						ctx.fill();

						if(isLast) {
							const left= right;
							const top= yPos-1;
							const bottom= top+this.halfRowHeight;
							ctx.beginPath();
							ctx.moveTo(left, top);
							ctx.lineTo(left+5, top+5);
							ctx.lineTo(left+5, bottom+5);
							ctx.lineTo(left, bottom);
							ctx.fillStyle= this.shadowColors[1];
							ctx.fill();
						}

						this.spritesheet.draw(this.blocks[0], ctx, xPos, yPos);
						break;
					}
					case "_":
						colWidth= this.smallBlockSize.x;
						this.spritesheet.draw(this.blocks[0], ctx, xPos, yPos+this.halfRowHeight);
						break;
					default:
						colWidth= this.smallBlockSize.x;
				}
				previous= row[colIdx];
				xPos+= colWidth;
			}
			yPos+= this.rowHeight;
		}

		this.font.size= 2;
		this.font.print(ctx, this.levelNumber, 12, 4, this.fontColor);

		return canvas;
	}

	render({viewport:{ctx}}) {
		ctx.drawImage(this.levelImage, 20, 55);
	}
}