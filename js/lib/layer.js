define(['item'], function(Item) {

  function Layer(z) {
    this.items = []
    this.z = z

    this.map = {}

    this.world = null
  }

  Layer.prototype.init = function init(world) {
    this.world = world
  }

  Layer.prototype.has = function has(item) {
    return this.items.indexOf(item) >= 0
  }

  Layer.prototype.contains = function contains(x, y, z) {
    for(var i = 0, len = this.items.length, item; i < len; i++) {
      item = this.items[i]
      if (item.x === x && item.y === y && item.z === z)
        return true
    }
  }

  Layer.prototype.render = function render(ctx) {
    for (var i = 0, len = this.items.length, item; i < len; i++) {
      item = this.items[i]
      if (!item._visible && !item.neighbors(this.world.player)) {
        continue
      } else {
        item._visible = true
      }
      ctx.save()
      if (item.covers(this.world.player)) {
        ctx.globalAlpha = 0.4
      }
      item.render(ctx)
      item.postRender()
      ctx.restore()
    }
  }

  Layer.prototype.add = function add(item) {
    item.init(this)
    this.insert(item)
  }

  Layer.prototype.insert = function insert(item) {
    if (this.items.length === 0) {
      this.items.push(item)
      return
    }

    var i = 0
      , j = this.items.length - 1
      , middle = 0
      , cmp

    while (i <= j) {
      middle = (i + j) >> 1
      cmp = Item.compare(item, this.items[middle])

      if (cmp == 0) {
        break
      } else if (cmp < 0) {
        j = middle - 1
      } else {
        i = middle + 1
      }
    }

    if (cmp > 0) {
      middle++
    }

    this.items.splice(middle, 0, item)
  }

  Layer.prototype.sort = function sort() {
    this.items = this.items.sort(Item.compare)
  }

  Layer.compare = function compare(a, b) {
    if (a.z > b.z) return -1
    if (a.z < b.z) return 1

    return a.x + a.y - b.x - b.y
  }

  return Layer
})