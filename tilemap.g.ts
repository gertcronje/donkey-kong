// Auto-generated code. Do not edit.
namespace myTiles {
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency16 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile1 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile3 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile2 = image.ofBuffer(hex``);

    helpers._registerFactory("tilemap", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "level1":
            case "level1":return tiles.createTilemap(hex`0a0011000000000000000000000000000000000000000000020000000000000000000202000000000000000002020200000000000000020202020202020202010000030000000000000100000000000000000001000000000000000000010102020202020202020201000000000000000000010000000000000000000100000000000000000002020202020202020201000000000300000000010000000000000000000100000000000000000001`, img`
. . . . . . . . . . 
. . . . . . . . . . 
2 . . . . . . . . . 
2 2 . . . . . . . . 
2 2 2 . . . . . . . 
2 2 2 2 2 2 2 2 2 . 
. . . . . . . . . . 
. . . . . . . . . . 
. . . . . . . . . . 
. 2 2 2 2 2 2 2 2 2 
. . . . . . . . . . 
. . . . . . . . . . 
. . . . . . . . . . 
2 2 2 2 2 2 2 2 2 . 
. . . . . . . . . . 
. . . . . . . . . . 
. . . . . . . . . . 
`, [myTiles.transparency16,myTiles.tile1,myTiles.tile2,myTiles.tile3], TileScale.Sixteen);
        }
        return null;
    })

    helpers._registerFactory("tile", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "transparency16":return transparency16;
            case "Ladder_place_holder":
            case "tile1":return tile1;
            case "hammer_bonus":
            case "tile3":return tile3;
            case "myTile":
            case "tile2":return tile2;
        }
        return null;
    })

}
// Auto-generated code. Do not edit.
