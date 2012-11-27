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
    
    for (var row = 0; row < 10; row++) {
      for (var col = 0; col < 10; col++) {
        game.add(block.create({
          img: sprites.tile
        , width: 62
        , height: 30 
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
        player.command('move', 'ne', release)
      } else if (code === 40 || code === 83) { // down | s
        player.command('move', 'sw', release)
      } else if (code === 37 || code === 65) { // left | a
        player.command('move', 'nw', release)
      } else if (code === 39 || code === 68) { // right | d
        player.command('move', 'se', release)
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