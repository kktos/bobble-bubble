import { ptInRect } from "../math.js";
import Trait from './Trait.js';
import KillableTrait from "./killable.trait.js";

export default class KillIfOffscreenTrait extends Trait {
    update(entity, {scene}) {
		if(!ptInRect(entity.left, entity.top, scene.bbox)) {
			if(entity.traits.has(KillableTrait))
				entity.traits.get(KillableTrait).kill();
			return;
		}
    }
}
