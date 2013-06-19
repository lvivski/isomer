new Sprites({
  player: 'images/player.png',
  blocks: 'images/blocks.png'
}).load(function (sprites) {

  var world = new World({
    canvas: document.getElementById('canvas'),
    cell: {
      width: 64,
      height: 32
    }
  })

  var player = new Player(sprites.player)

  world.setPlayer(player)

  var map = "\
0001011000\
1101000010\
0001011010\
1011010010\
1000011110\
1111010000\
0000000111\
1110110000\
0010110111\
0000000001\
"

  var size = 10
  for (var i = 0; i < map.length; ++i) {
    var x = i % size,
        y = Math.floor(i / size),
        type = map[i]

    world.add(new Block({
      sprite: sprites.blocks,
      width: 64,
      height: 64,
      x: x,
      y: y,
      z: player.z - 1,
      sx: 256,
      sy: 192
    }))

    if (type === '1') {
      world.add(new Block({
        sprite: sprites.blocks, width: 64, height: 64, x: x, y: y, z: player.z, sx: 320, sy: 320
      }))
    }
  }

  var moving = false
  window.addEventListener('keydown', function onkeydown(e) {
    var code = e.keyCode

    if (moving) return
    moving = true

    if (code === 38 || code === 87) { // up | w
      player.command('move', {y: -1}, release)
    } else if (code === 40 || code === 83) { // down | s
      player.command('move', {y: 1}, release)
    } else if (code === 37 || code === 65) { // left | a
      player.command('move', {x: -1}, release)
    } else if (code === 39 || code === 68) { // right | d
      player.command('move', {x: 1}, release)
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
