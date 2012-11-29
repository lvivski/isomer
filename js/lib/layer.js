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
        ctx.globalAlpha = 0.5
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
    this.items.push(item)
    this.sort()
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