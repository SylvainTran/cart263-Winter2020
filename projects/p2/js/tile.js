
    let tileMap = [
        1,1,1,1,1,1,1,1,1,1,1,
        1,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,1,
        1,1,1,1,0,0,0,1,1,1,1
    ];
    const NUM_TILES = 6 * 11;
    let $divTilemap = $(".map");
    for(let i = 0; i < NUM_TILES; i++) {
        let tile = document.createElement("DIV");
        console.log(tileMap[i]);
        if(tileMap[i] === 1) {
            tile.setAttribute("class", "wall");
        } else {
            tile.setAttribute("class", "ground");
        }
        $divTilemap.append(tile);    
    }
    let wallTiles = document.querySelectorAll('.wall');