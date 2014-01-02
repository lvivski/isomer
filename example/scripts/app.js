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
00010110000001011000\
11010000101101000010\
00010110100001011010\
10110100101011010010\
10000111101000011110\
11110100001111010000\
00000001110000000111\
11101100001110110000\
00101101110010110111\
00000000010000000001\
00010110000001011000\
11010000101101000010\
00010110100001011010\
10110100101011010010\
10000111101000011110\
11110100001111010000\
00000001110000000111\
11101100001110110000\
00101101110010110111\
00000000010000000001\
"

	var size = 20
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
			z: player.z + 1,
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
