import { System } from "./System.view.js";
import { DebugView } from "./debug.view.js";

export const SYSTEM= Symbol("System");

export const views= {
	DebugView,

	[SYSTEM] : null,
};

export function initViews(ctx) {
	views[SYSTEM]= new System(ctx);
}