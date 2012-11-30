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

  Layer.prototype.render = function render(ctx) {
    var lx = -this.world.cx
      , rx = -this.world.cx + this.world.width
      , ly = -this.world.cy
      , ry = -this.world.cy + this.world.height
      
    for (var i = 0, len = this.items.length, item; i < len; i++) {
      item = this.items[i]
      if (!item.in(lx, ly, rx, ry)) continue
      if (!item._discovered && !item.neighbors(this.world.player)) {
        continue
      } else {
        item._discovered = true
      }
      ctx.globalAlpha = 1
      if (item.covers(this.world.player)) {
        ctx.globalAlpha = 0.6
      }
      item.render(ctx)
      item.animation()
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
    
    var pos = search(item, this.items, Item.compare)

    this.items.splice(pos, 0, item)
  }
  
  Layer.prototype.get = function get(x, y, z) {
    if (this.items.length === 0) return false
    
    // var cell = { x: x, y: y, z: z }
      // , pos = search(cell, this.items, Item.compare)
    for (var i = 0, item, cmp; i < this.items.length; i++) {
      item = this.items[i]
      // cmp = Item.compare(cell, item)
      // if (cmp > 0) break
      if (x === item.x && y === item.y && z === item.z) return item
    }

    return false
  }
  
  Layer.prototype.remove = function remove(item) {
    var index = this.items.indexOf(item)
    if (index !== -1) this.items.splice(index, 1)
  };

  Layer.prototype.sort = function sort() {
    this.items = this.items.sort(Item.compare)
  }

  Layer.compare = function compare(a, b) {
    if (a.z > b.z) return -1
    if (a.z < b.z) return 1
    return 0
  }

  return Layer
  
  function search(needle, stack, comparator) {
    var i = 0
      , j = stack.length - 1
      , middle = 0
      , cmp

    while (i <= j) {
      middle = (i + j) >> 1
      cmp = comparator(stack[middle], needle)
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
})