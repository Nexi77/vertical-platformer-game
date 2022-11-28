import { CTX } from '../index.js';

class CollisionBlock {
    constructor({ position, height = 16 }){
        this.position = position;
        this.width = 16;
        this.height = height;
    }
}

export default CollisionBlock;