import { createViewport } from "../../../utils/canvas.utils.js";
import BackgroundLayer from "../../background.layer.js";

export class DebugView {

	constructor(ctx) {
		this.gc= ctx.gc;
		this.vars= ctx.vars;
		this.width= ctx.canvas.width;
		this.height= ctx.canvas.height;
		this.ctx= ctx.canvas.getContext('2d');
		this.canvas= ctx.canvas;

		this.vars.set("frameSpriteSize", {x:0, y:0});
		this.vars.set("anim", { loopInitialValue:0, len:0, frames:{length:0}});
		this.vars.set("frameSprite", "");

		this.rezMgr= this.gc.resourceManager;
		this.spritesheetList= this.rezMgr.byKind("sprite");
		
		this.bkgndIndex= 0;
		
		this.buildUI(ctx.layer, this.spritesheetList);

		this.setSpritesheet(0);

	}
 
	destroy() {
	}

	buildUI(layer, list) {
		const options= list.map((item, idx) => `<option value="${idx}">${item.replace(/^[^:]+:/,"")}</option>`);
		const html= `
			<div class="vcenter hcenter">
				BACKGROUND
				<input id="bkgndIndex" type="number" class="w50" value="${this.bkgndIndex}" min="0" max="${BackgroundLayer.SPRITES.length-1}"/>
				<div class="grid-column vcenter">
					<div id="btnPrevAnim" class="btn light-shadow">
						<div class="icn z50 icn-up-arrow"></div>Previous
					</div>
					<div id="btnNextAnim" class="btn light-shadow">
						<div class="icn z50 icn-down-arrow"></div>
						Next
					</div>
					<div id="btnPlayAnim" class="btn light-shadow">
					<div class="icn z50 icn-down-play"></div>
						Play
					</div>
				</div>
				<div class="grid-column vcenter">
					<div id="btnPlusAnim" class="btn light-shadow">
						+
					</div>
					<div id="btnMinusAnim" class="btn light-shadow">
						-
					</div>
					<div id="btnStepAnim" class="btn light-shadow">
						S
					</div>
					<div id="btnAAnim" class="btn light-shadow">
						A
					</div>
					<div id="btnZAnim" class="btn light-shadow">
						Z
					</div>
				</div>
			</div>
			<div class="vcenter hcenter">
				<style>
				#SpriteBrowser {
					display: grid;
					grid-template: auto 1fr / 200px 200px;
					grid-gap: 5px;				
				}
				</style>
				<div id="SpriteBrowser">
					<div>GROUP</div><div>SPRITES</div>
					<select id="ss" size="7">${options}</select>
					<select id="ss-items" size="7">${options}</select>
				</div>
			</div>
		`;

		layer.setContent(html, this);
	}

	onClickUIBtn(id) {
		switch(id) {
			case "btnPrevAnim":
				this.prevAnim();
				break;
			case "btnNextAnim":
				this.nextAnim();
				break;
			case "btnPlayAnim":
				this.playAnim();
				break;				
			case "btnPlusAnim":
				this.plusAnim();
				break;				
			case "btnMinusAnim":
				this.minusAnim();
				break;				
			case "btnStepAnim":
				this.sAnim();
				break;				
			case "btnAAnim":
				this.zAnim();
				break;				
			case "btnZAnim":
				this.zAnim();
				break;				
		}
	}

	onChangeUI(el) {
		switch(el.id) {
			case "bkgndIndex":
				this.setBackground(el.value);
				break;
			case "ss":
				this.setSpritesheet(el.value);
				break;
			case "ss-items":
				this.updateSpriteListUI(el.value);
				break;
		}
	}

	handleEvent(gc, e) {
		switch(e.type) {
			case "keydown":
				switch(e.key) {
					case "ArrowDown":
						this.prevAnim();
						break;
					case "ArrowUp":
						this.nextAnim();
						break;
				}
		}
	}

	updateSpriteListUI(name) {
		this.spriteIndex= this.names.indexOf(name);
	}

	prevAnim() {
		this.spriteIndex= this.spriteIndex > 0 ? this.spriteIndex-1 : this.names.length-1;
		this.vars.set("spriteIndex", this.spriteIndex);
	}

	nextAnim() {
		if(this.spriteIndex < this.names.length-1)
			this.spriteIndex++;
		this.vars.set("spriteIndex", this.spriteIndex);
	}
	playAnim() {
		const anim= this.animations.get(this.names[this.spriteIndex]);
		anim
			.reset();
	}
	plusAnim() {
		const anim= this.animations.get(this.names[this.spriteIndex]);
		anim.len= (anim.len*10 - 1)/10;
		if(anim.len<=0)
			anim.len= 0.1;
	}
	minusAnim() {
		const anim= this.animations.get(this.names[this.spriteIndex]);
		anim.len= (anim.len*10 + 1)/10;		
	}
	sAnim() {
		this.stepAnim= !this.stepAnim;
	}
	aAnim() {
		const anim= this.animations.get(this.names[this.spriteIndex]);
		this.step--;
		if(this.step<0)
			this.step= anim.frames.length-1;
	}
	zAnim() {
		const anim= this.animations.get(this.names[this.spriteIndex]);
		this.step= (this.step +1) % anim.frames.length;
	}

	setSpritesheet(idx) {
		this.spritesheetName= this.spritesheetList[idx];
		this.spritesheet= this.rezMgr.get(this.spritesheetName);
		this.animations= this.spritesheet.animations;
		this.sprites= this.spritesheet.sprites;

		this.names= [...this.sprites.keys(), ...this.animations.keys()];
		this.vars.set("names", this.names);

		this.spriteIndex= 0;
		this.vars.set("spriteIndex", this.spriteIndex);

		this.pauseAnim= false;
		this.stepAnim= false;
		this.step= 0;

		const itemList= document.querySelector("#ss-items");
		itemList.options.length= 0;
		for (let idx = 0; idx < this.names.length; idx++) {
			const opt= document.createElement("option");
			opt.text= this.names[idx];
			itemList.options.add(opt);
		}

	}

	setBackground(bkgndIndex) {
		this.bkgndIndex= bkgndIndex % BackgroundLayer.SPRITES.length;
		this.gc.scene.events.emit(BackgroundLayer.EVENT_UPDATE_BKGND, this.bkgndIndex, false);
	}

	render(gc) {
		const localGc= {...gc};
		localGc.viewport= createViewport(this.canvas);
		this.ctx.clearRect(0, 0, this.width, this.height);

		const name= this.names[this.spriteIndex];
		const anim= this.animations.get(name);
		if(anim) {
			this.vars.set("spriteType", "anim");
			this.vars.set("anim", anim);
			const step= this.stepAnim ? this.step : gc.tick/100;
			const frameSprite= anim.frame(step);
			this.vars.set("frameSprite", frameSprite);
			const frameSpriteSize= this.spritesheet.spriteSize(frameSprite);
			this.vars.set("frameSpriteSize", frameSpriteSize);
			// this.spritesheet.draw(frameSprite, this.ctx, this.width-frameSpriteSize.x-50, 50);
			this.spritesheet.draw(frameSprite, this.ctx, this.width/2-frameSpriteSize.x, this.height/2-frameSpriteSize.y, {zoom:2});
			return;
		}

		if(this.sprites.has(name)) {
			this.vars.set("spriteType", "sprite");
			const spriteSize= this.spritesheet.spriteSize(name);
			this.spritesheet.draw(name, this.ctx, this.width/2-spriteSize.x, this.height/2-spriteSize.y, {zoom:2});
		}

	}

}