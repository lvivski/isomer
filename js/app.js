require.config({
  baseUrl: 'js/lib'
})

require([
  'world'
, 'player'
, 'block'
, 'sprites'
], function(World, Player, Block, sprites) {
  sprites.load(function(sprites){
    
    var world = new World({
      canvas: document.getElementById('canvas'),
      cell: {
        width: 64,
        height: 32
      }
    })
    
    var player = new Player(sprites.player)
    
    world.setPlayer(player)
    
    for (var row = 0; row < 10; row++) {
      for (var col = 0; col < 10; col++) {
        world.add(new Block({
          sprite: sprites.blocks
        , width: 64
        , height: 64 
        , x: row
        , y: col
        , z: 0
        , sx: 256
        , sy: 192
        }))
        
        if (!(row%5) || !(col%5)) {
          world.add(new Block({
            sprite: sprites.blocks
          , width: 64
          , height: 64 
          , x: row
          , y: col
          , z: 1
          , sx: 320
          , sy: 320
          }))
        }
      }
    }
    
    var moving = false
    window.addEventListener('keydown', function onkeydown(e) {
      var code = e.keyCode
      
      if (moving) return
      moving = true

      if (code === 38 || code === 87) { // up | w
        player.command('move', {dx: 0, dy: -1, dz: 0}, release)
      } else if (code === 40 || code === 83) { // down | s
        player.command('move', {dx: 0, dy: 1, dz: 0}, release)
      } else if (code === 37 || code === 65) { // left | a
        player.command('move', {dx: -1, dy: 0, dz: 0}, release)
      } else if (code === 39 || code === 68) { // right | d
        player.command('move', {dx: 1, dy: 0, dz: 0}, release)
        /*} else if (code === 32 || code === 16) { // space | shift

      } else if (code === 13 || code === 69) { // enter | e

      } else if (code === 82){ // r
      */
      } else {
        release()
      }
      
      function release() {
        moving = false
      }
      
      //e.preventDefault()
    }, true)
  })
})