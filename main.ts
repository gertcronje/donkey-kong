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
function destroy_hammers () {
    for (let h of sprites.allOfKind(SpriteKind.Weapon)) {
        sprites.destroy(h)
    }
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (mario.vy == 0) {
        music.play(music.createSoundEffect(WaveShape.Square, 400, 600, 255, 0, 100, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
        mario.vy = -150
        jumping = 1
    }
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    hammer_dir = 0
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
function barrel_movement () {
    for (let b of sprites.allOfKind(SpriteKind.Projectile)) {
        check_if_barrel_is_on_ladder(b)
        if (isBarrelOnLadder) {
            animation.stopAnimation(animation.AnimationTypes.ImageAnimation, b)
            if (b.vy == 0 && b.x < 80) {
                b.vx = 50
                b.vy = -50
                animation.runImageAnimation(
                b,
                assets.animation`barrel_animation_right`,
                200,
                true
                )
            }
            if (b.vy == 0 && b.x > 80) {
                b.vx = -50
                b.vy = -50
                animation.runImageAnimation(
                b,
                assets.animation`barrel_animation_left`,
                200,
                true
                )
            }
        }
        if (b.x <= 8 && b.y > map_bottom) {
            sprites.destroy(b)
        }
    }
}
function is_close (sprite1: Sprite, sprite2: Sprite, num: number) {
    is_close_result = false
    if (Math.abs(sprite1.x - sprite2.x) <= num) {
        is_close_result = true
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
    destroy_hammers()
    hammer = sprites.create(assets.image`hammer_up`, SpriteKind.Weapon)
    music.play(music.melodyPlayable(music.jumpUp), music.PlaybackMode.InBackground)
    sprites.destroy(otherSprite)
    has_weapon = 1
    barrels_smashed = 0
    info.changeScoreBy(5)
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
function update_mario () {
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
        mario.setImage(assets.image`mario_back`)
    } else {
        // Apply gravity when not on a ladder
        mario.ay = g
        if (mario.vx < 0) {
            mario.setImage(assets.image`mario_left`)
        } else {
            if (mario.vx > 0) {
                mario.setImage(assets.image`mario_right`)
            } else {
                mario.setImage(assets.image`mario_front`)
            }
        }
    }
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    hammer_dir = 1
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Projectile, function (sprite, otherSprite) {
    music.play(music.melodyPlayable(music.zapped), music.PlaybackMode.UntilDone)
    sprites.destroy(otherSprite)
    sprites.destroy(sprite, effects.disintegrate, 500)
    info.changeLifeBy(-1)
    if (info.life() > 0) {
        create_mario()
        scene.cameraFollowSprite(mario)
        has_weapon = 0
        destroy_hammers()
    }
})
function create_mario () {
    mario = sprites.create(assets.image`mario_front`, SpriteKind.Player)
    mario.setPosition(8, map_bottom)
    controller.moveSprite(mario, 50, 0)
}
function update_jump_score () {
    for (let c of sprites.allOfKind(SpriteKind.Projectile)) {
        if (jumping) {
            is_close(mario, c, 16)
            if (is_close_result) {
                if (mario.y < c.y - 16 && mario.y > c.y - 32) {
                    info.changeScoreBy(5)
                    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
                    jumping = 0
                }
            }
        }
    }
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
        info.changeScoreBy(10)
        sprites.destroy(otherSprite)
        music.play(music.melodyPlayable(music.bigCrash), music.PlaybackMode.InBackground)
        barrels_smashed += 1
        if (barrels_smashed > 2) {
            has_weapon = 0
            destroy_hammers()
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
let is_close_result = false
let princess: Sprite = null
let hammer_hit = 0
let isMarioOnLadder = false
let isBarrelOnLadder = false
let mario: Sprite = null
let jumping = 0
let barrels_smashed = 0
let hammer_dir = 0
let has_weapon = 0
let map_bottom = 0
let g = 0
music.play(music.melodyPlayable(music.powerUp), music.PlaybackMode.UntilDone)
music.play(music.stringPlayable(music.convertRTTTLToMelody("Mario:d=16,o=5,b=100:32p,e6,e6,p,e6,p,c6,e6,p,g6,8p,p,g,8p,32p,c6,8p,g,8p,e,8p,a,p,b,p,a#,a,p,g,e6,g6,a6,p,f6,g6,p,e6,p,c6,d6,b,4p,g6,f#6,f6,d#6,p,e6,p,g#,a,c6,p,a,c6,d6,8p,8d#6,p,d6,8p,8c6"), 200), music.PlaybackMode.LoopingInBackground)
scene.setBackgroundColor(1)
tiles.setCurrentTilemap(tilemap`level1`)
info.setLife(5)
g = 350
map_bottom = 532
scene.centerCameraAt(0, 0)
create_mario()
create_ladders()
create_kong()
create_princess()
place_hammer_bonus()
has_weapon = 0
hammer_dir = 0
barrels_smashed = 0
jumping = 0
timer.after(4000, function () {
    scene.cameraFollowSprite(mario)
})
game.onUpdate(function () {
    update_mario()
    barrel_movement()
    if (has_weapon) {
        draw_hammer()
        if (hammer_hit > 0) {
            hammer_hit += -1
        }
    }
    update_jump_score()
})
game.onUpdateInterval(8000, function () {
    create_new_barrel()
})
