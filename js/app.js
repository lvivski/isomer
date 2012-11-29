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
    
    var map ="\
0001011000\
1101000000\
0001011000\
1011010000\
1000010000\
1111000000\
0000000000\
0000000000\
0000000000\
0000000000\
"

    for (var i = 0, len = map.length, type, x, y; i < len; i++ ) {
      x = i % 10
      y = Math.floor(i / 10)
      type = map[i]
      
      world.add(new Block({
        sprite: sprites.blocks
      , width: 64
      , height: 64
      , x: x
      , y: y
      , z: player.z - 1
      , sx: 256
      , sy: 192
      }))
      
      if (type === '1') {
        world.add(new Block({
          sprite: sprites.blocks
        , width: 64
        , height: 64
        , x: x
        , y: y
        , z: player.z
        , sx: 320
        , sy: 320
        }))
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