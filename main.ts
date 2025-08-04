namespace SpriteKind {
    export const Bonus = SpriteKind.create()
    export const Weapon = SpriteKind.create()
    export const Princess = SpriteKind.create()
    export const Ladder = SpriteKind.create()
}
function check_if_barrel_is_on_ladder (barrel_sprite: Sprite) {
    isBarrelOnLadder = false
    for (let l of sprites.allOfKind(SpriteKind.Ladder)) {
        if (barrel_sprite.overlapsWith(l)) {
            isBarrelOnLadder = true
            break;
        }
    }
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (isMarioOnLadder) {
        mario.y += -10
    }
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    hammer_hit = 4
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
    if (mario.vy == 0) {
        mario.vy = -150
    }
})
function create_princess () {
    princess = sprites.create(img`
        . . . . . . 5 . 5 . . . . . . . 
        . . . . . f 5 5 5 f f . . . . . 
        . . . . f 1 5 2 5 1 6 f . . . . 
        . . . f 1 6 6 6 6 6 1 6 f . . . 
        . . . f 6 6 f f f f 6 1 f . . . 
        . . . f 6 f f d d f f 6 f . . . 
        . . f 6 f d f d d f d f 6 f . . 
        . . f 6 f d 3 d d 3 d f 6 f . . 
        . . f 6 6 f d d d d f 6 6 f . . 
        . f 6 6 f 3 f f f f 3 f 6 6 f . 
        . . f f d 3 5 3 3 5 3 d f f . . 
        . . f d d f 3 5 5 3 f d d f . . 
        . . . f f 3 3 3 3 3 3 f f . . . 
        . . . f 3 3 5 3 3 5 3 3 f . . . 
        . . . f f f f f f f f f f . . . 
        . . . . . f f . . f f . . . . . 
        `, SpriteKind.Princess)
    princess.setPosition(24, 40)
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    hammer_dir = 0
})
function barrel_movement () {
    for (let b of sprites.allOfKind(SpriteKind.Projectile)) {
        check_if_barrel_is_on_ladder(b)
        if (b.x >= 154) {
            b.vx = -50
            animation.stopAnimation(animation.AnimationTypes.ImageAnimation, b)
        }
        if (b.x <= 4) {
            b.vx = 50
            animation.stopAnimation(animation.AnimationTypes.ImageAnimation, b)
        }
        if (isBarrelOnLadder) {
            if (b.vy == 0 && b.x < 80) {
                b.vx = 50
            }
            if (b.vy == 0 && b.x > 80) {
                b.vx = -50
            }
        }
        if (b.x <= 8 && b.y > 260) {
            sprites.destroy(b)
        }
    }
}
function place_hammer_bonus () {
    for (let hammer_pos of tiles.getTilesByType(assets.tile`hammer_bonus`)) {
        m = sprites.create(assets.image`hammer_down`, SpriteKind.Bonus)
        tiles.setTileAt(hammer_pos, assets.tile`transparency16`)
        tiles.placeOnTile(m, hammer_pos)
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Bonus, function (sprite, otherSprite) {
    hammer = sprites.create(assets.image`hammer_up`, SpriteKind.Weapon)
    music.play(music.melodyPlayable(music.jumpUp), music.PlaybackMode.InBackground)
    sprites.destroy(otherSprite)
    has_weapon = 1
    barrels_smashed = 0
})
function create_new_barrel () {
    barrel = sprites.create(assets.image`barrel`, SpriteKind.Projectile)
    animation.runImageAnimation(
    barrel,
    assets.animation`barrel_animation_right`,
    200,
    true
    )
    barrel.setPosition(16, 24)
    // Apply gravity when not on a ladder
    barrel.ay = g
    // Apply gravity when not on a ladder
    barrel.vx = 50
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    hammer_dir = 1
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Projectile, function (sprite, otherSprite) {
    music.play(music.melodyPlayable(music.wawawawaa), music.PlaybackMode.InBackground)
    sprites.destroy(otherSprite)
    info.changeLifeBy(-1)
})
function create_mario () {
    mario = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . f f f f f f . . . . . . 
        . . . f 2 f e e e e f f . . . . 
        . . f 2 2 2 f e e e e f f . . . 
        . . f e e e e f f e e e f . . . 
        . f e 2 2 2 2 e e f f f f . . . 
        . f 2 e f f f f 2 2 2 e f . . . 
        . f f f e e e f f f f f f f . . 
        . f e e 4 4 f b e 4 4 e f f . . 
        . . f e d d f 1 4 d 4 e e f . . 
        . . . f d d d d 4 e e e f . . . 
        . . . f e 4 4 4 e d d 4 . . . . 
        . . . f 2 2 2 2 e d d e . . . . 
        . . f f 5 5 4 4 f e e f . . . . 
        . . f f f f f f f f f f . . . . 
        . . . f f f . . . f f . . . . . 
        `, SpriteKind.Player)
    mario.setPosition(8, 264)
    controller.moveSprite(mario, 50, 0)
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (isMarioOnLadder) {
        mario.y += 10
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Princess, function (sprite, otherSprite) {
    music.play(music.melodyPlayable(music.magicWand), music.PlaybackMode.InBackground)
    game.gameOver(true)
})
function create_ladders () {
    for (let ladder_pos of tiles.getTilesByType(assets.tile`Ladder_place_holder`)) {
        m = sprites.create(assets.image`ladder`, SpriteKind.Ladder)
        tiles.setTileAt(ladder_pos, assets.tile`transparency16`)
        tiles.placeOnTile(m, ladder_pos)
    }
}
function create_kong () {
    kong = sprites.create(assets.image`kong`, SpriteKind.Enemy)
    kong.setPosition(8, 24)
}
sprites.onOverlap(SpriteKind.Weapon, SpriteKind.Projectile, function (sprite, otherSprite) {
    if (hammer_hit > 0) {
        info.changeScoreBy(3)
        sprites.destroy(otherSprite)
        music.play(music.melodyPlayable(music.bigCrash), music.PlaybackMode.InBackground)
        barrels_smashed += 1
        if (barrels_smashed > 2) {
            has_weapon = 0
            sprites.destroy(hammer)
        }
    }
})
function draw_hammer () {
    if (hammer_hit > 0) {
        hammer.setImage(assets.image`hammer_down`)
        hammer.y = mario.y
    } else {
        hammer.setImage(assets.image`hammer_up`)
        hammer.y = mario.y - 8
    }
    if (hammer_dir == 0) {
        hammer.x = mario.x - 16
    } else {
        hammer.image.flipX()
        hammer.x = mario.x + 16
    }
}
let kong: Sprite = null
let barrel: Sprite = null
let hammer: Sprite = null
let m: Sprite = null
let princess: Sprite = null
let hammer_hit = 0
let isMarioOnLadder = false
let isBarrelOnLadder = false
let mario: Sprite = null
let barrels_smashed = 0
let hammer_dir = 0
let has_weapon = 0
let g = 0
music.play(music.melodyPlayable(music.powerUp), music.PlaybackMode.UntilDone)
scene.setBackgroundColor(1)
tiles.setCurrentTilemap(tilemap`level1`)
info.setLife(3)
g = 350
scene.centerCameraAt(0, 0)
create_mario()
create_ladders()
create_kong()
create_princess()
place_hammer_bonus()
has_weapon = 0
hammer_dir = 0
barrels_smashed = 0
timer.after(1000, function () {
    scene.cameraFollowSprite(mario)
})
game.onUpdate(function () {
    isMarioOnLadder = false
    for (let n of sprites.allOfKind(SpriteKind.Ladder)) {
        if (mario.overlapsWith(n)) {
            isMarioOnLadder = true
            break;
        }
    }
    if (isMarioOnLadder) {
        // No gravity when on any ladder
        mario.ay = 0
        // No gravity when on any ladder
        mario.vy = 0
    } else {
        // Apply gravity when not on a ladder
        mario.ay = g
    }
    barrel_movement()
    if (has_weapon) {
        draw_hammer()
        if (hammer_hit > 0) {
            hammer_hit += -1
        }
    }
})
game.onUpdateInterval(10000, function () {
    create_new_barrel()
})
