function Region(x, y, z) {
	this.items = []
	this.x = x
	this.y = y
	this.z = z

	this.lx = this.x - 5
	this.ly = this.y - 5
	this.lz = this.z - 5

	this.rx = this.x + 5
	this.ry = this.y + 5
	this.rz = this.z + 5

	this.world = null
}

Region.prototype.init = function (world) {
	this.world = world
	this.ctx = world.ctx
}

Region.prototype.has = function (item) {
	return this.items.indexOf(item) >= 0
}

Region.prototype.contains = function (item) {
	var x = Math.round(item.x),
	    y = Math.round(item.y),
	    z = Math.round(item.z)
	return this.lx <= x && x < this.rx &&
		this.ly <= y && y < this.ry &&
		this.lz <= z && z < this.rz
};

Region.prototype.render = function (tick) {
	var lx = -this.world.cx,
	    rx = -this.world.cx + this.world.width,
	    ly = -this.world.cy,
	    ry = -this.world.cy + this.world.height,
			z = this.world.player.z

	for (var i = 0; i < this.items.length; i++) {
		var item = this.items[i]
		if (item.z < z) break
		if (!item.in(lx, ly, rx, ry)) continue
		if (!item._discovered && !item.neighbors(this.world.player)) {
			continue
		} else {
			item._discovered = true
		}

		var covers = item.covers(this.world.player)
		if (covers) {
			this.ctx.save()
			this.ctx.globalAlpha = 0.5
		}

		item.render(tick)
		item.animation(tick)

		if (covers) this.ctx.restore()
	}
}

Region.prototype.add = function (item) {
	item.init(this)
	this.insert(item)
}

Region.prototype.isVisible = function (z) {
	return this.lz <= z + 5 && z - 5 <= this.rz
}

Region.prototype.insert = function (item) {
	if (this.items.length === 0) {
		this.items.push(item)
		return
	}

	var pos = Region.search(item, this.items, Item.compare)

	this.items.splice(pos, 0, item)
}

Region.prototype.get = function (x, y, z) {
	if (this.items.length === 0) return false

	// var cell = { x: x, y: y, z: z }
	// , pos = search(cell, this.items, Item.compare)
	for (var i = 0; i < this.items.length; ++i) {
		var item = this.items[i]
		// cmp = Item.compare(cell, item)
		// if (cmp > 0) break
		if (x === item.x && y === item.y && z === item.z) return item
	}

	return false
}

Region.prototype.remove = function (item) {
	var index = this.items.indexOf(item)
	if (index !== -1) this.items.splice(index, 1)
}

Region.prototype.sort = function () {
	this.items = this.items.sort(Item.compare)
}


Region.compare = function (a, b) {
	if (a.z > b.z) return -1
	if (a.z < b.z) return 1

	return a.x + a.y - b.x - b.y
}

Region.search = function (needle, stack, comparator) {
	var i = 0,
	    j = stack.length - 1,
	    middle = 0

	while (i <= j) {
		middle = (i + j) >> 1

		var cmp = comparator(stack[middle], needle)

		if (cmp < 0) {
			i = middle + 1
		} else if (cmp > 0) {
			j = middle - 1
		} else {
			break
		}
	}

	if (cmp < 0) {
		middle++
	}

	return middle
}
