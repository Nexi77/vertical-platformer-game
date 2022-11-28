import CollisionBlock from './classes/CollisionBlock.js';
import { Player } from './classes/Player.js';
import Sprite from './classes/Sprite.js';

const CANVAS = document.querySelector('#canvas');
const CTX = canvas.getContext('2d');
CANVAS.width = 1024;
CANVAS.height = 576;
const SCALE_SIZE = 4;
const SCALED_CANVAS = {
    width: CANVAS.width / SCALE_SIZE,
    height: CANVAS.height / SCALE_SIZE,
};
const BLOCK_SIZE = 16;

const KEYS = {
    d: { pressed: false},
    a: { pressed: false},
}

const PLAYER_PHYSIC = {
    moveSpeed: 2,
    jumpHeight: 8
}

const BACKGROUND = new Sprite({ position: { x: 0, y: 0 }, imageSrc: '../assets/images/background/background.png'})
const FLOOR_COLLISIONS_2D = [];
const PLATFORM_COLLISIONS_2D = [];

for (let i=0; i < floorCollisions.length; i += 36) {
    FLOOR_COLLISIONS_2D.push(floorCollisions.slice(i, i+36));
}
const COLLISION_BLOCKS = [];
FLOOR_COLLISIONS_2D.forEach((row, rowIndex) => {
    row.forEach((symbol, symbolIndex) => {
        if(symbol === 202) {
            COLLISION_BLOCKS.push(new CollisionBlock({
                x: symbolIndex * BLOCK_SIZE,
                y: rowIndex * BLOCK_SIZE
            }))
        }
    });
})

for (let i=0; i < platformCollisions.length; i += 36) {
    PLATFORM_COLLISIONS_2D.push(platformCollisions.slice(i, i+36));
}

const PLATFORM_COLLISION_BLOCKS = [];
PLATFORM_COLLISIONS_2D.forEach((row, rowIndex) => {
    row.forEach((symbol, symbolIndex) => {
        if(symbol === 202) {
            PLATFORM_COLLISION_BLOCKS.push(new CollisionBlock({
                x: symbolIndex * BLOCK_SIZE,
                y: rowIndex * BLOCK_SIZE
            }))
        }
    });
})

const PLAYER = new Player({
    position: { x: 100, y: 350 },
    collisionBlocks: COLLISION_BLOCKS,
    imageSrc: '../assets/images/character/warrior/Idle.png',
    frameRate: 8,
    animations: {
        Idle: {
            imageSrc: '../assets/images/character/warrior/Idle.png',
            frameRate: 8,
            frameBuffer: 4
        },
        IdleLeft: {
            imageSrc: '../assets/images/character/warrior/IdleLeft.png',
            frameRate: 8,
            frameBuffer: 4
        },
        Run: {
            imageSrc: '../assets/images/character/warrior/Run.png',
            frameRate: 8,
            frameBuffer: 5
        },
        RunLeft: {
            imageSrc: '../assets/images/character/warrior/RunLeft.png',
            frameRate: 8,
            frameBuffer: 5
        },
        Jump: {
            imageSrc: '../assets/images/character/warrior/Jump.png',
            frameRate: 2,
            frameBuffer: 3
        },
        JumpLeft: {
            imageSrc: '../assets/images/character/warrior/JumpLeft.png',
            frameRate: 2,
            frameBuffer: 3
        },
        Fall: {
            imageSrc: '../assets/images/character/warrior/Fall.png',
            frameRate: 2,
            frameBuffer: 3
        },
        FallLeft: {
            imageSrc: '../assets/images/character/warrior/FallLeft.png',
            frameRate: 2,
            frameBuffer: 3
        },
    }
});


const animate = () => {
    requestAnimationFrame(animate);
    CTX.clearRect(0,0,CANVAS.width, CANVAS.height);
    CTX.save();
    CTX.scale(SCALE_SIZE, SCALE_SIZE);
    CTX.translate(0, -BACKGROUND.image.height + SCALED_CANVAS.height)
    BACKGROUND.update();
    COLLISION_BLOCKS.forEach(block => {
        block.update();
    })
    PLATFORM_COLLISION_BLOCKS.forEach(block => {
        block.update();
    })
    PLAYER.update();
    PLAYER.setXVelocity(0);
    if (KEYS.d.pressed) {
        PLAYER.switchSprite('Run')
        PLAYER.setXVelocity(PLAYER_PHYSIC.moveSpeed)
        PLAYER.setDirection('right')
    }
    else if (KEYS.a.pressed) {
        PLAYER.switchSprite('RunLeft')
        PLAYER.setXVelocity(-PLAYER_PHYSIC.moveSpeed)
        PLAYER.setDirection('left')
    }
    else if (PLAYER.velocity.x === 0 && PLAYER.velocity.y === 0) {
        if (PLAYER.lastDirection === 'right')
            PLAYER.switchSprite('Idle')
        else PLAYER.switchSprite('IdleLeft')
    }
    if (PLAYER.velocity.y < 0) {
        if(PLAYER.lastDirection === 'right')
            PLAYER.switchSprite('Jump')
        else PLAYER.switchSprite('JumpLeft')
    }
    else if (PLAYER.velocity.y > 0) {
        if(PLAYER.lastDirection === 'right')
            PLAYER.switchSprite('Fall')
        else PLAYER.switchSprite('FallLeft')
    }
    CTX.restore();
}

animate();

window.addEventListener('keydown', (e) => {
    if(e.key === 'w' && e.repeat) return;
    switch(e.key){
        case 'd':
            KEYS.d.pressed = true;
            break;
        case 'a':
            KEYS.a.pressed = true;
            break;
        case 'w':
            PLAYER.setYVelocity(-PLAYER_PHYSIC.jumpHeight);
            break;
    }
})

window.addEventListener('keyup', (e) => {
    if(e.key === 'w' && e.repeat) return;
    switch(e.key){
        case 'd':
            KEYS.d.pressed = false;
            break;
        case 'a':
            KEYS.a.pressed = false;
            break;
    }
})

export { CANVAS, CTX };

