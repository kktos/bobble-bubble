import ENV from "../../env";
import { growRect } from "../../maths/math";
import { OP_TYPES } from "../../script/types/operation.types.js";
import { renderSprite } from "./sprite.renderer";

export function renderMenu(gc, layer, menu) {
	const selectedColor = menu.selection?.color ?? ENV.COLORS.SELECTED_TEXT;

	const renderMenuItem = (item, layer, isSelected) => {
		switch (item.type) {
			case OP_TYPES.TEXT: {
				// 	layer.renderText(gc, {
				// 		...item,
				// 		color: isSelected ? selectedColor : item.color,
				// 	});
				if (item.entity) item.entity.color = isSelected ? selectedColor : item.color;
				break;
			}
			case OP_TYPES.SPRITE:
				renderSprite(gc, layer, item);
				break;
			case OP_TYPES.GROUP:
				{
					const submenu = item;
					for (const item of submenu.items) {
						renderMenuItem(item, layer, isSelected);
					}
				}
				break;
		}
	};

	for (let idx = 0; idx < menu.items.length; idx++) {
		const item = menu.items[idx];
		if (idx === layer.itemSelected) {
			renderSelection(gc, menu, item);
			renderMenuItem(item, layer, true);
			continue;
		}
		renderMenuItem(item, layer, false);
	}
}

function renderSelection(gc, menu, item) {
	const bkgndColor = menu.selection?.background;
	const ctx = gc.viewport.ctx;
	const rect = item.bbox;

	if (bkgndColor) {
		const selectRect = growRect(rect, 2, 5);
		ctx.fillStyle = bkgndColor;
		ctx.fillRect(selectRect.x, selectRect.y, selectRect.width + 2, selectRect.height - 4);
	} else {
		ctx.strokeStyle = menu.selection?.color ?? ENV.COLORS.SELECT_RECT;
		ctx.beginPath();
		ctx.moveTo(rect.left - 2, rect.top - 5);
		ctx.lineTo(rect.right + 4, rect.top - 5);
		ctx.moveTo(rect.left - 2, rect.bottom + 2);
		ctx.lineTo(rect.right + 4, rect.bottom + 2);
		ctx.stroke();
	}

	if (menu.selectionSprites?.left) {
		const { ss, sprite } = menu.selectionSprites.left;
		ss.drawAnim(sprite, ctx, rect.left - 25, rect.top - 2, gc.tick);
	}
	if (menu.selectionSprites?.right) {
		const { ss, sprite } = menu.selectionSprites.right;
		ss.drawAnim(sprite, ctx, rect.right + 4, rect.top - 2, gc.tick);
	}
}
