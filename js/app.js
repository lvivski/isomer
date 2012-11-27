require.config({
  baseUrl: 'js/lib'
})

require([
  'ui'
, 'player'
, 'block'
, 'sprites'
], function(ui, player, block, sprites) {
  sprites.load(function(sprites){
    
    game = ui.create({
      canvas: document.getElementById('canvas'),
      cell: {
        width: 64,
        height: 32
      }
    })
    
    player = player.create(sprites.player)
    
    game.setPlayer(player)
    
    for (var row = 0; row < 25; row++) {
      for (var col = 0; col < 25; col++) {
        game.add(block.create({
          sprite: sprites.tile
        , width: 64
        , height: 32 
        , x: row
        , y: col
        , z: 0
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
      } else if (code === 32 || code === 16) { // space | shift

      } else if (code === 13 || code === 69) { // enter | e

      } else if (code === 82){ // r

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