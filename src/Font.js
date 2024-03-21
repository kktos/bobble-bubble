import SpriteSheet from './Spritesheet.js';
import ENV from "./env.js";
import { nameToRgb } from "./utils/canvas.utils.js";
import { loadImage, loadJson } from './utils/loaders.util.js';

// const CHARS= ' 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ©!-×.';
export const Align= {
    Left: 1,
    Center: 2,
    Right: 3
}

function loadFont(sheet) {
    return loadImage(sheet.img)
        .then(image => {
            const fontSprite= new SpriteSheet(image);
            const offsetX= sheet.offsetX|0;
            const offsetY= sheet.offsetY|0;
            const gapX= sheet.gapX|0;
            const rowLen= image.width;
            for (const [index, char] of [...sheet.charset].entries()) {
                const x= offsetX + index * (sheet.width+gapX) % rowLen;
                const y= offsetY + Math.floor(index * (sheet.width+gapX) / rowLen) * sheet.width;
                fontSprite.define(char, x, y, sheet.width, sheet.height);
            }

            return new Font(sheet.name, fontSprite, sheet.height, sheet.width);
        });
}

export default class Font {
	static load(filename) {
		return loadJson(ENV.FONTS_PATH + filename)
					.then(sheet => loadFont(sheet));
	}

    constructor(name, sprites, height, width) {
        this.name= name;
        this.sprites= sprites;
        this.spriteHeight= height;
        this.spriteWidth= width;
        this.size= 1;
        this.align= Align.Left;
        this.cache= new Map();
    }

    get height() {
        return this.spriteHeight * this.size;
    }
    get width() {
        return this.spriteWidth * this.size;
    }

    textRect(text, x, y) {
        const str= String(text).toUpperCase();
        const width= str.length * this.width;
        switch(this.align) {
            case Align.Center:
                x-= width / 2;
                break;
            case Align.Right:
                x-= width;
                break;
        }
        return [x, y, x+width, y+this.height];
    }

    print(context, text, x, y, color=null) {
        const key= JSON.stringify([text,x,y,color]);
        if(!this.cache.has(key)) {
            const canvas= document.createElement('canvas');
            const str= String(text).toUpperCase();
    
            canvas.width= str.length * this.width;
            canvas.height= this.height;
    
            const ctx= canvas.getContext('2d');
            ctx.imageSmoothingEnabled= false;
            [...str].forEach((char, pos) => {
                    this.sprites.draw(char, ctx, pos * this.width, 0, {zoom: this.size});
            });
            
            // if(color) {
            //     ctx.globalCompositeOperation= "source-in";
            //     ctx.fillStyle= color;
            //     ctx.fillRect(0, 0, canvas.width, canvas.height);
            // }

            if(color) {
                const [r, g, b] = nameToRgb(color);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                for (let i = 0; i < data.length; i += 4) {
                    if(data[i]===255 && data[i]===255 && data[i+2]===255) {
                        data[i] = r;
                        data[i + 1] = g;
                        data[i + 2] = b;
                    }
                }
                ctx.putImageData(imageData, 0, 0);
            }

            this.cache.set(key, canvas);
        }    

        const canvas= this.cache.get(key);
        
        switch(this.align) {
            case Align.Center:
                x-= canvas.width / 2;
                break;
            case Align.Right:
                x-= canvas.width;
                break;
        }

        context.drawImage(canvas, x, y);
        return [x, y, x+canvas.width, y+canvas.height];
    }

}