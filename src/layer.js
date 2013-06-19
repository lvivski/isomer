function Layer(z) {
  this.items = []
  this.z = z

  this.map = {}

  this.world = null
}

Layer.prototype.init = function (world) {
  this.world = world
  this.ctx = world.ctx
}

Layer.prototype.has = function (item) {
  return this.items.indexOf(item) >= 0
}

Layer.prototype.render = function (tick) {
  var lx = -this.world.cx,
      rx = -this.world.cx + this.world.width,
      ly = -this.world.cy,
      ry = -this.world.cy + this.world.height

  for (var i = 0, len = this.items.length; i < len; i++) {
    var item = this.items[i]
    if (!item.in(lx, ly, rx, ry)) continue
    if (!item._discovered && !item.neighbors(this.world.player)) {
      continue
    } else {
      item._discovered = true
    }
    this.ctx.globalAlpha = 1
    if (item.covers(this.world.player)) {
      this.ctx.globalAlpha = 0.6
    }
    item.render(tick)
    item.animation(tick)
  }
}

Layer.prototype.add = function (item) {
  item.init(this)
  this.insert(item)
}

Layer.prototype.insert = function (item) {
  if (this.items.length === 0) {
    this.items.push(item)
    return
  }

  var pos = Layer.search(item, this.items, Item.compare)

  this.items.splice(pos, 0, item)
}

Layer.prototype.get = function (x, y, z) {
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

Layer.prototype.remove = function (item) {
  var index = this.items.indexOf(item)
  if (index !== -1) this.items.splice(index, 1)
};

Layer.prototype.sort = function () {
  this.items = this.items.sort(Item.compare)
}

Layer.compare = function (a, b) {
  if (a.z > b.z) return -1
  if (a.z < b.z) return 1
  return 0
}

Layer.search = function (needle, stack, comparator) {
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
