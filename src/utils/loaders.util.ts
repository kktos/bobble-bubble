export async function loadImage(name: string): Promise<HTMLImageElement> {
	console.log(`loadImage(${name})`);
	const m = await import(`/assets/images/${name}`);
	const url = m.default;
	return await new Promise((resolve) => {
		const image = new Image();
		image.addEventListener("load", () => resolve(image));
		image.src = url;
	});
}

export async function loadSound(name: string) {
	console.log(`loadSound(${name})`);
	const m = await import(`/assets/sounds/${name}`);
	const url = m.default;
	return await fetch(url);
}

export async function loadJson(url: string) {
	console.log(`loadJson(${url})`);
	const m = await import(`/assets/${url}`);
	return m.default;
}

export function saveFileAs(filename: string, data: unknown) {
	const blob = new Blob([JSON.stringify(data, null, 2)]);
	const link = document.createElement("a");
	link.download = filename;
	link.href = window.URL.createObjectURL(blob);
	link.click();
}
