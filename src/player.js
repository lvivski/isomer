function Player(sprite) {
	Item.call(this, {
		sprite: sprite,
		width: 64,
		height: 64,
		x: 0,
		y: 0,
		z: 0,
		sx: 0,
		sy: 192
	})

	this._discovered = true
}

Player.prototype = Object.create(Item.prototype)
Player.prototype.constructor = Player

Player.prototype.command = function (cmd, options, callback) {
	if (cmd === 'move') {
		var sy = 0
		if (options.y > 0)
			sy = 192
		else if (options.x > 0)
			sy = 64
		else if (options.x < 0)
			sy = 128
		this.animate({x: options.x, y: options.y, z: options.z, sy: sy, frames: 4}, 300, callback)
	} else {
		callback()
	}
}

Player.prototype.render = function () {
	this.ctx.drawImage(
		this.sprite,
		this.sx,
		this.sy,
		this.width,
		this.height,
		this.projection.x - 32,
		this.projection.y - 24,
		this.width,
		this.height
	)
}
