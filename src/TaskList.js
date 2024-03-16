import { generateID } from "./utils/id.util.js";

export default class TaskList {

	constructor() {
		this.id= generateID();

		this.tasks= [];
		this.taskHandlers= new Map();
	}

	addTask(name, ...args) {
		this.tasks.push({name, args});
	}

	onTask(name, handler) {
		this.taskHandlers.set(name, handler);
	}

	processTasks() {
		if(!this.tasks.length)
			return;
		// biome-ignore lint/complexity/noForEach: <explanation>
		this.tasks.forEach(({name, args}) => {
			const handler= this.taskHandlers.get(name);
			if(handler)
				handler(...args);
			else {
				console.log("----- TASK: no handler for", name.toString());
				console.log("taskHandlers", this.taskHandlers);
			}
		});
		this.tasks.length= 0;
	}	 


}