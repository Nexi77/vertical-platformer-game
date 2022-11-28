import { collision, platformCollision } from "../utils.js";
import Sprite from "./Sprite.js";

const GRAVITY = 0.1;

export class Player extends Sprite {
    constructor({ position, collisionBlocks, platformCollisionBlocks, imageSrc, frameRate, scale = 0.5, animations }){
        super({ imageSrc, frameRate, scale })
        this.position = position
        this.velocity = {
            x: 0,
            y: 1
        }
        this.collisionBlocks = collisionBlocks
        this.platformCollisionBlocks = platformCollisionBlocks
        this.hitbox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: 10,
            height: 10
        }
        this.animations = animations
        this.lastDirection = 'right'

        for (let key in this.animations) {
            const image = new Image()
            image.src = this.animations[key].imageSrc
            this.animations[key].image = image
        }
    }
    
    setXVelocity(x){
        this.velocity.x = x;
    }

    setYVelocity(y){
        this.velocity.y = y;
    }

    setDirection(direction) {
        this.lastDirection = direction
    }

    updateHitbox(){
        this.hitbox = {
            position: {
                x: this.position.x + 35,
                y: this.position.y + 25
            },
            width: 14,
            height: 28
        }
    }

    switchSprite(key){ 
        if(this.image === this.animations[key].image || !this.loaded) return
        this.currentFrame = 0
        this.image = this.animations[key].image
        this.frameRate = this.animations[key].frameRate
        this.frameBuffer = this.animations[key].frameBuffer
    }

    update(){
        this.updateFrames();
        this.draw();
        this.position.x += this.velocity.x;
        this.updateHitbox();
        this.checkForHorizontalCollisions()
        this.applyGravity();
        this.updateHitbox();
        this.checkForVerticalCollisions();
    }

    applyGravity(){
        this.velocity.y += GRAVITY;
        this.position.y += this.velocity.y;
    }

    checkForVerticalCollisions(){
        for(let i=0; i < this.collisionBlocks.length; i++){
            const block = this.collisionBlocks[i];
            if (collision({ object1: this.hitbox, object2: block })){
                if(this.velocity.y > 0) {
                    this.velocity.y = 0
                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;
                    this.position.y = block.position.y - offset - 0.01;
                    break;
                }
                if(this.velocity.y < 0) {
                    this.velocity.y = 0;
                    const offset = this.hitbox.position.y - this.position.y;
                    this.position.y = block.position.y + block.height - offset + 0.01;
                    break;
                }
            }
        }

        // platform collisions
        for(let i=0; i < this.platformCollisionBlocks.length; i++){
            const block = this.platformCollisionBlocks[i];
            if (platformCollision({ object1: this.hitbox, object2: block })){
                if(this.velocity.y > 0) {
                    this.velocity.y = 0
                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;
                    this.position.y = block.position.y - offset - 0.01;
                    break;
                }
            }
        }
    }

    checkForHorizontalCollisions(){
        for(let i=0; i<this.collisionBlocks.length; i++){
            const block = this.collisionBlocks[i];
            if (collision({ object1: this.hitbox, object2: block })){
                if(this.velocity.x > 0) {
                    this.velocity.x = 0
                    const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;
                    this.position.x = block.position.x - offset - 0.01
                    break;
                }
                if(this.velocity.x < 0) {
                    this.velocity.x = 0
                    const offset = this.hitbox.position.x - this.position.x;
                    this.position.x = block.position.x + block.width - offset + 0.01
                    break;
                }
            }
        }
    }
}