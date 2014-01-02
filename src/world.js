function World(options) {
	this.canvas = options.canvas
	this.ctx = this.canvas.getContext('2d')
	this.ctx.webkitspritesmoothingEnabled = false

	this.width = canvas.width
	this.height = canvas.height

	this.cell = options.cell

	this.cx = 0
	this.cy = 0

	this.center = { x: 0, y: 0, z: 0 }
	this.projection = this.project(this.center.x, this.center.y, this.center.z)

	this.regions = []

	this._changed = false

	this.init()
}

World.prototype.init = function () {
	var self = this,
	    onframe = window.webkitRequestAnimationFrame
	      || window.requestAnimationFrame

	onframe(function render(tick) {
		self.render(tick)
		onframe(render)
	})
}

World.prototype.project = function (x, y, z) {
	return {
		x: Math.round((x - y) * this.cell.width / 2),
		y: Math.round(((x + y) / 2 + z) * this.cell.height)
	}
}

World.prototype.render = function (tick) {
	if (!this._changed) return
	this._changed = false

	this.cx = Math.round(this.width / 2 - this.projection.x)
	this.cy = Math.round(this.height / 2 - this.projection.y)

	this.ctx.save()
	this.ctx.clearRect(0, 0, this.width, this.height)
	this.ctx.translate(this.cx, this.cy)

	for (var i = 0; i < this.regions.length; i++) {
		if (this.regions[i].isVisible(this.center.z)) {
			this.regions[i].sort()
			this.regions[i].render(tick)
		}
	}

	this.ctx.restore()
}

World.prototype.add = function (item) {
	var region = this.getRegion(item)
	if (!region) {
		var x = Math.round(item.x / 10) * 10 + 5,
		    y = Math.round(item.y / 10) * 10 + 5,
		    z = Math.round(item.z / 10) * 10 + 5;

		region = new Region(x, y, z)
		this.addRegion(region)
	}

	region.add(item)
}

World.prototype.getRegion = function (item) {
	for (var i = 0, len = this.regions.length; i < len; i++) {
		if (this.regions[i].contains(item)) {
			return this.regions[i];
		}
	}
	return false
}

World.prototype.addRegion = function (region) {
	region.init(this)
	this.regions.push(region)
}

World.prototype.setPlayer = function (item) {
	this.player = item

	this.setCenter(item.x, item.y, item.z)
	this.add(item)
}

World.prototype.setCenter = function (x, y, z, regionChanged) {
	this.center = { x: x, y: y, z: z }
	this.projection = this.project(x, y, z)

	if (this.regions.length !== 0 && !regionChanged) return;

	this.regions.sort(Region.compare);
}

World.prototype.handleMove = function (item) {
	var regionChanged = false

	if (!item.region.contains(item)) {
		regionChanged = true

		item.remove()

		for (var i = 0; i < this.regions.length; i++) {
			if (this.regions[i].contains(item)) {
				this.regions[i].add(item)
				break
			}
		}
	}

	if (this.player === item) {
		this.setCenter(item.x, item.y, item.z, regionChanged)
	}
}

World.prototype.hasObstacle = function (x, y, z) {
	var region = this.getRegion({x: x, y: y, z: z })

	if (!region) return true

	return !!region.get(x, y, z)
};
