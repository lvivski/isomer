function Item(options) {
	this.sprite = options.sprite
	this.width = options.width
	this.height = options.height

	this.x = options.x
	this.y = options.y
	this.z = options.z

	this.sx = options.sx
	this.sy = options.sy

	this.animations = []

	this._discovered = false
}

Item.prototype.init = function (layer) {
	this.layer = layer
	this.world = layer.world
	this.ctx = layer.ctx
	this.position(this.x, this.y, this.z)
	this.offset(this.sx, this.sy)
}

Item.prototype.position = function (x, y, z) {
	this.x = x
	this.y = y
	this.z = z

	this.projection = this.world.project(this.x, this.y, this.z)

	this.world.handleMove(this)
	this.world._changed = true
}

Item.prototype.in = function (lx, ly, rx, ry) {
	var w = this.width,
		h = this.height,
		center = this.projection

	return center.x + w >= lx && center.x - w <= rx
		&& center.y + h >= ly && center.y - h <= ry
}

Item.prototype.offset = function (x, y) {
	this.sx = x || 0
	this.sy = y || 0

	this.world._changed = true
}

Item.prototype.move = function (dx, dy, dz) {
	this.position(this.x + dx, this.y + dy, this.z + dz)
}

Item.prototype.covers = function (item) {
	if (Item.compare(this, item) <= 0 || this === item)
		return false

	var dx = this.projection.x - item.projection.x,
	    dy = this.projection.y - item.projection.y,
	    dist = dx * dx + dy * dy

	if (dist < 3000) return true
}

Item.prototype.neighbors = function (item) {
	var dx = this.x - item.x,
	    dy = this.y - item.y,
	    dist = dx * dx + dy * dy

	if (dist < 9) // 3 blocks around
		return true
}

Item.prototype.render = function (tick) {
}

Item.prototype.animate = function (props, interval, callback) {
	this.animations.push(new Animation(this, props, interval, callback))
	this.world._changed = true
}

Item.prototype.animation = function (tick) {
	if (this.animations.length === 0) return

	while (this.animations.length !== 0) {
		var first = this.animations[0]
		first.init(tick)

		if (first.start + first.interval <= tick) {
			this.animations.shift()
			first.end()
			this.world._changed = true
			continue
		}

		first.run(tick)
		this.world._changed = true
		break
	}
}

Item.prototype.reset = function () {
	if (this.animation.length === 0) return

	for (var i = 0, len = this.animation.length; i < len; i++) {
		var a = this.animation[i]
		a.init()
		a.end()
	}
	this.animation = []
}

Item.prototype.remove = function () {
	this.layer.remove(this)
}

Item.compare = function compare(a, b) {
	if (a.z > b.z) return -1
	if (a.z < b.z) return 1

	return a.x + a.y - b.x - b.y
}
