import { System } from "./System.view.js";

export const SYSTEM= Symbol("System");

export const views= {
	[SYSTEM] : null,
};

export function initViews(ctx) {
	views[SYSTEM]= new System(ctx);
}