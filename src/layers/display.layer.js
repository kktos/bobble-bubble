import { createEntity } from "../entities/EntityFactory.js";
import TextEntity from "../entities/text.entity.js";
import ENV from "../env.js";
import { ptInRect } from "../maths/math.js";
import { Scene } from "../scene/Scene.js";
import { evalExpr, evalNumber } from "../script/engine/eval.script.js";
import { execAction } from "../script/engine/exec.script.js";
import { OP_TYPES } from "../script/types/operation.types.js";
import PathTrait from "../traits/path.trait.js";
import { clone } from "../utils/object.util.js";
import LocalDB from "../utils/storage.util.js";
import { UILayer } from "./UILayer.js";
import { renderMenu } from "./display/menu.renderer.js";
import { loadSprite, renderSprite } from "./display/sprite.renderer.js";
import { Timers } from "./display/timers.class.js";
import { initViews, views } from "./display/views/views.js";
import { EntitiesLayer } from "./entities.layer.js";

export class DisplayLayer extends UILayer {
	static EVENT_TIME_OUT = "TIME_OUT";

	constructor(gc, parent, sheet) {
		super(gc, parent, sheet.ui);

		const rezMgr = gc.resourceManager;
		this.font = rezMgr.get("font", sheet.font ?? ENV.MAIN_FONT);

		this.layout = sheet.layout;
		this.time = 0;
		this.blinkFlag = false;
		this.isMouseEnabled = true;
		this.wannaDisplayHitzones = false;
		this.lastJoyTime = 0;

		this.itemSelected = 0;

		this.vars = new Map();
		this.initVars();

		const menus = this.layout.filter((op) => op.type === OP_TYPES.MENU);
		if (menus.length > 1) throw new Error("Only one menu is allowed per viewport");

		this.menu = menus.length > 0 ? menus[0] : null;

		this.views = this.layout.filter((op) => op.type === OP_TYPES.VIEW);
		initViews({ gc, vars: this.vars, layer: this });

		this.prepareRendering(gc);

		this.timers = Timers.createTimers(sheet);

		if (sheet.on) {
			for (const [name, value] of Object.entries(sheet.on)) {
				const [eventName, id] = name.split(":");
				parent.events.on(eventName, (...args) => {
					// biome-ignore lint/suspicious/noDoubleEquals: <explanation>
					if (id && args[0] != id) return;
					execAction({ gc, vars: this.vars }, value.action);
				});
			}
		}

		if (sheet.sounds) {
			const sounds = new Map();
			for (const [key, soundDef] of Object.entries(sheet.sounds)) {
				const [soundSheet, name] = key.split(":");
				const audio = rezMgr.get("audio", soundSheet);
				const sound = {
					name,
					audio,
					play: () => audio.play(name),
				};
				if (soundDef.play) {
					parent.events.on(Scene.EVENT_START, () => sound.audio.play(name));
				}
				sounds.set(key, sound);
			}
			this.vars.set("sounds", sounds);
		}
	}

	destroy() {
		for (let idx = 0; idx < this.views.length; idx++) {
			const view = this.views[idx];
			view.component.destroy();
		}
	}

	initVars() {
		this.vars.set("highscores", LocalDB.highscores());
		this.vars.set("player", LocalDB.currentPlayer());
		this.vars.set("itemIdxSelected", this.itemSelected);
		this.vars.set("itemSelected", "");

		this.vars.set("mouseX", 0);
		this.vars.set("mouseY", 0);

		const spriteList = [];
		const sprites = {
			get: (idx) => spriteList[idx],
			add: (sprite) => {
				spriteList.push(sprite);
			},
		};
		this.vars.set("sprites", sprites);

		this.vars.set("clientHeight", ENV.VIEWPORT_HEIGHT);
		this.vars.set("clientWidth", ENV.VIEWPORT_WIDTH);
		this.vars.set("centerX", Math.floor(ENV.VIEWPORT_WIDTH / 2));
		this.vars.set("centerY", Math.floor(ENV.VIEWPORT_HEIGHT / 2));
		this.vars.set("centerUIY", Math.floor((this.gc.viewport.bbox.height - ENV.UI_HEIGHT) / 2 / this.gc.viewport.ratioHeight));
	}

	selectMenuItem(idx) {
		this.itemSelected = (idx < 0 ? this.menu.items.length - 1 : idx) % this.menu.items.length;
		this.vars.set("itemIdxSelected", this.itemSelected);
		this.vars.set("itemSelected", this.menu?.items[this.itemSelected]);
		this.scene.events.emit("MENU_ITEM_SELECTED", this.itemSelected);
	}

	execMenuItemAction(gc, idx = null) {
		if (!this.menu) return;

		const selectedIdx = idx == null ? this.itemSelected : idx;
		const menuItem = this.menu.items[selectedIdx];

		if (menuItem.action) {
			return execAction({ gc, vars: this.vars }, menuItem.action);
		}

		this.scene.events.emit("MENU_ITEM_CLICKED", selectedIdx);
	}
	prepareMenu(gc, op) {
		const menuItems = [];
		for (let idx = 0; idx < op.items.length; idx++) {
			const item = op.items[idx];
			switch (item.type) {
				case OP_TYPES.REPEAT:
					this.repeat(item, (menuitem) => menuItems.push(menuitem));
					break;
				// case "text":
				default:
					menuItems.push(item);
					break;
			}
		}

		const computeBBox = (items, isGroup = false) => {
			let bbox = null;
			for (let idx = 0; idx < items.length; idx++) {
				const item = items[idx];
				switch (item.type) {
					case OP_TYPES.TEXT: {
						this.addText(item);
						if (item.align) this.font.align = item.align;
						if (item.size) this.font.size = item.size;
						const r = this.font.textRect(item.text, item.pos[0], item.pos[1]);
						item.bbox = { left: r[0], top: r[1], right: r[2], bottom: r[3] };
						break;
					}
					case OP_TYPES.IMAGE: {
						const { ss, sprite } = loadSprite(gc, item.sprite);
						const size = ss.spriteSize(sprite);
						item.bbox = {
							left: item.pos[0],
							top: item.pos[1],
							right: item.pos[0] + size.x,
							bottom: +item.pos[1] + size.y,
						};
						break;
					}
					case OP_TYPES.GROUP: {
						item.bbox = computeBBox(item.items, true);
						break;
					}
				}
				if (isGroup) {
					if (bbox === null) {
						bbox = { ...item.bbox };
						continue;
					}
					if (item.bbox.left < bbox.left) {
						bbox.left = item.bbox.left;
					}
					if (item.bbox.top < bbox.top) {
						bbox.top = item.bbox.top;
					}
					if (item.bbox.right > bbox.right) {
						bbox.right = item.bbox.right;
					}
					if (item.bbox.bottom > bbox.bottom) {
						bbox.bottom = item.bbox.bottom;
					}
				}
			}
			return bbox;
		};

		computeBBox(menuItems);

		op.items = menuItems;

		op.selectionSprites = null;
		if (op.selection) {
			op.selectionSprites = {};
			if (op.selection.left) {
				op.selectionSprites.left = loadSprite(gc, op.selection.left);
			}
			if (op.selection.right) {
				op.selectionSprites.right = loadSprite(gc, op.selection.right);
			}
		}
	}

	repeat(op, callback) {
		const processItem = (item, idx) => {
			switch (item.type) {
				case OP_TYPES.TEXT:
					item.text = evalExpr({ vars: this.vars }, item.text);
					break;
				case OP_TYPES.IMAGE:
					item.sprite = evalExpr({ vars: this.vars }, item.sprite);
					break;
			}
			item.pos[0] += idx * op.step.pos[0];
			item.pos[1] += idx * op.step.pos[1];
		};

		const count = evalExpr({ vars: this.vars }, op.count);

		for (let idx = 0; idx < count; idx++) {
			if (op.var) {
				this.vars.set(op.var, idx);
			}

			for (let itemIdx = 0; itemIdx < op.items.length; itemIdx++) {
				const item = clone(op.items[itemIdx]);

				if (item.type === OP_TYPES.GROUP) {
					for (const groupItem of item.items) {
						processItem(groupItem, idx);
					}
				} else {
					processItem(item, idx);
				}

				callback(item);
			}
		}
	}

	repeatFor(op, callback) {
		const count = evalExpr({ vars: this.vars }, op.count);

		for (let idx = 0; idx < count; idx++) {
			if (op.var) {
				this.vars.set(op.var, idx);
			}

			for (let itemIdx = 0; itemIdx < op.items.length; itemIdx++) {
				const item = clone(op.items[itemIdx]);
				item.pos[0] += idx * op.step.pos[0];
				item.pos[1] += idx * op.step.pos[1];
				callback(item);
			}
		}
	}

	addText(op) {
		const textObj = {
			pos: op.pos,
			align: op.align,
			size: op.size,
			color: op.color,
			anim: op.anim,
			text: () => evalExpr({ vars: this.vars }, op.text),
		};
		const entity = new TextEntity(this.gc.resourceManager, textObj);
		this.scene.addTask(EntitiesLayer.TASK_ADD_ENTITY, entity);
		op.entity = entity;
	}

	addSprite(op) {
		const entity = createEntity(this.gc.resourceManager, op.sprite, op.pos[0], op.pos[1], op.dir);
		if (op.anim) {
			const anim = this.vars.get(op.anim.name);
			if (!anim) {
				throw new Error(`Animation ${op.anim.name} not found`);
			}
			entity.addTrait(new PathTrait(anim));
		}
		this.scene.addTask(EntitiesLayer.TASK_ADD_ENTITY, entity);
		op.entity = entity;
		this.vars.get("sprites").add(entity);
	}

	prepareRendering(gc) {
		// biome-ignore lint/complexity/noForEach: <explanation>
		this.layout
			.filter((op) => op.type === OP_TYPES.VIEW)
			.forEach((view) => {
				this.vars.set(view.name, null);
			});

		console.log(">>> LAYOUT", this.layout);

		for (let idx = 0; idx < this.layout.length; idx++) {
			const op = this.layout[idx];
			switch (op.type) {
				case OP_TYPES.TEXT: {
					this.addText(op);
					break;
				}
				case OP_TYPES.SPRITE: {
					this.addSprite(op);
					break;
				}
				case OP_TYPES.ANIM: {
					this.vars.set(op.name, op);
					break;
				}
				case OP_TYPES.SET:
					this.vars.set(op.name, evalExpr({ vars: this.vars }, op.value));
					break;
				case OP_TYPES.REPEAT:
					this.repeat(op, (item) => this.layout.push(item));
					break;
				case OP_TYPES.VIEW:
					this.prepareView(gc, op);
					break;
			}
		}

		// this.prepareViews(gc);

		if (this.menu) this.prepareMenu(gc, this.menu);
	}

	prepareView(gc, viewDesc) {
		// const viewList = this.layout.filter((op) => op.type === OP_TYPES.VIEW);

		// for (let idx = 0; idx < viewList.length; idx++) {
		// 	const viewDesc = viewList[idx];

		if (!views[viewDesc.view]) throw new TypeError(`Unknown View Type ${viewDesc.view}`);

		const width = evalNumber({ vars: this.vars }, viewDesc.width);
		const height = evalNumber({ vars: this.vars }, viewDesc.height);
		const left = evalNumber({ vars: this.vars }, viewDesc.pos[0]);
		const top = evalNumber({ vars: this.vars }, viewDesc.pos[1]);

		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;

		const ctx = { canvas, gc, vars: this.vars, layer: this };
		viewDesc.component = new views[viewDesc.view](ctx);
		viewDesc.canvas = canvas;
		viewDesc.bbox = {
			left,
			top,
			right: width + left,
			bottom: height + top,
		};
		this.vars.set(viewDesc.name, viewDesc.component);
		// const elm= document.body.appendChild(canvas);
		// }
	}

	findMenuByPoint(x, y) {
		return this.menu.items.findIndex((item) => ptInRect(x, y, item.bbox));
	}

	menuMoveUp() {
		if (this.menu) {
			this.selectMenuItem(this.itemSelected - 1);
		}
	}

	menuMoveDown() {
		if (this.menu) this.selectMenuItem(this.itemSelected + 1);
	}

	handleEvent(gc, e) {
		switch (e.type) {
			case "click":
				if (this.isMouseEnabled && this.menu) {
					const menuIdx = this.findMenuByPoint(e.x, e.y);
					if (menuIdx >= 0) this.execMenuItemAction(gc, menuIdx);
				}
				break;

			// case "joyaxismove":
			// 	if(e.timestamp - this.lastJoyTime < 200)
			// 		return;
			// 	this.lastJoyTime= e.timestamp;
			// 	if(e.vertical < -0.1)
			// 		return this.menuMoveUp();
			// 	if(e.vertical > 0.1)
			// 		return this.menuMoveDown();

			case "joybuttondown":
				if (e.X || e.TRIGGER_RIGHT) return this.execMenuItemAction(gc);
				if (e.CURSOR_UP) return this.menuMoveUp();
				if (e.CURSOR_DOWN) return this.menuMoveDown();
				break;

			case "mousemove":
				this.vars.set("mouseX", e.x);
				this.vars.set("mouseY", e.y);

				if (this.isMouseEnabled && this.menu) {
					const menuIdx = this.findMenuByPoint(e.x, e.y);
					if (menuIdx >= 0) this.selectMenuItem(menuIdx);
					gc.viewport.canvas.style.cursor = menuIdx >= 0 ? "pointer" : "default";
				}
				break;

			case "keyup":
				switch (e.key) {
					case "Control":
						this.wannaDisplayHitzones = false;
						break;
				}
				break;

			case "keydown":
				switch (e.key) {
					case "Control":
						this.wannaDisplayHitzones = true;
						break;

					case "ArrowDown":
					case "ArrowRight":
						this.menuMoveDown();
						break;
					case "ArrowUp":
					case "ArrowLeft":
						this.menuMoveUp();
						break;
					case "Enter":
						this.execMenuItemAction(gc);
						break;
				}
				break;
		}

		// console.log("DisplayLayer.handleEvent", e);

		for (let idx = 0; idx < this.views.length; idx++) {
			const view = this.views[idx];

			// if(["mousemove", "mouseup","mousedown", "click"].includes(e.type)) {
			// 	if(!ptInRect(e.x, e.y, view.bbox)) {
			// 		continue;
			// 	}
			// }

			const localEvent = {
				...e,
				pageX: e.x,
				pageY: e.y,
				x: e.x - view.pos[0],
				y: e.y - view.pos[1],
			};
			view.component.handleEvent(gc, localEvent);
		}
	}

	// renderText(gc, op) {
	// 	if (op.blink && this.blinkFlag) return;
	// 	if (op.align) this.font.align = op.align;
	// 	if (op.size) this.font.size = op.size;

	// 	if (op.anim) {
	// 		switch (op.anim.name) {
	// 			case "fadein":
	// 				if (!op.anim.state) {
	// 					op.anim.state = {
	// 						color: hexToRgb(op.color),
	// 						alpha: 0,
	// 					};
	// 				}
	// 				op.anim.state.alpha += gc.deltaTime / 3;
	// 				if (op.anim.state.alpha > 255) {
	// 					op.anim = "none";
	// 					break;
	// 				}
	// 				op.color = `rgba(${op.anim.state.color[0]}, ${op.anim.state.color[1]}, ${op.anim.state.color[2]}, ${op.anim.state.alpha})`;
	// 				break;
	// 		}
	// 	}

	// 	const text = evalExpr({ vars: this.vars }, op.text);
	// 	return this.font.print(gc.viewport.ctx, text === "" ? " " : text, op.pos[0], op.pos[1], op.color);
	// }

	renderRect({ viewport: { ctx } }, op) {
		ctx.fillStyle = op.color;
		ctx.fillRect(
			evalNumber({ vars: this.vars }, op.pos[0]),
			evalNumber({ vars: this.vars }, op.pos[1]),
			evalNumber({ vars: this.vars }, op.width),
			evalNumber({ vars: this.vars }, op.height),
		);
		// ctx.strokeStyle= op.color;
		// ctx.strokeRect(op.pos[0], op.pos[1], op.width, op.height);
	}

	renderView(gc, op) {
		op.component.render(gc);
		// gc.viewport.ctx.imageSmoothingEnabled = false;
		// gc.viewport.ctx.globalAlpha= 1;
		// gc.viewport.ctx.globalCompositeOperation = "source-over";
		const left = evalNumber({ vars: this.vars }, op.pos[0]);
		const top = evalNumber({ vars: this.vars }, op.pos[1]);

		gc.viewport.ctx.drawImage(op.canvas, left, top);
	}

	update(gc, scene) {
		this.timers?.update(gc, scene);
	}

	render(gc) {
		const ctx = gc.viewport.ctx;

		this.time += (gc.dt * 1000) | 0;
		if (!((this.time % 500) | 0)) this.blinkFlag = !this.blinkFlag;

		for (let idx = 0; idx < this.layout.length; idx++) {
			const op = this.layout[idx];
			switch (op.type) {
				// case OP_TYPES.SPRITE:
				// 	renderSprite(gc, this, op);
				// 	break;
				case OP_TYPES.IMAGE:
					renderSprite(gc, this, op);
					break;
				case OP_TYPES.MENU:
					renderMenu(gc, this, op);
					break;
				case OP_TYPES.RECT:
					this.renderRect(gc, op);
					break;
				case OP_TYPES.VIEW:
					this.renderView(gc, op);
					break;
				// default:
				// 	throw new Error(`Unkown operation ${op.type}`);
			}
		}

		if (this.wannaDisplayHitzones && this.menu) {
			const items = this.menu.items;
			for (let idx = 0; idx < items.length; idx++) {
				const item = items[idx];
				ctx.strokeStyle = "red";
				ctx.strokeRect(item.bbox.left, item.bbox.top, item.bbox.right - item.bbox.left, item.bbox.bottom - item.bbox.top);
				ctx.fillStyle = "red";
				ctx.fillText(`${item.type}`, item.bbox.left, item.bbox.bottom + 10);

				ctx.fillStyle = "white";
				const str = `Selected: ${this.itemSelected} X: ${this.gc.mouse.x} Y: ${this.gc.mouse.y}`;
				ctx.fillText(str, gc.viewport.width - 200, gc.viewport.height - 15);
			}
		}
	}
}
