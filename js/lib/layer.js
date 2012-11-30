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
    for (var i = 0, len = this.items.length, item; i < len; i++) {
      item = this.items[i]
      if (!item._visible && !item.neighbors(this.world.player)) {
        continue
      } else {
        item._visible = true
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
    
    var middle = search(item, this.items, Item.compare)

    this.items.splice(middle, 0, item)
  }
  
  Layer.prototype.get = function get(x, y, z) {
    if (this.items.length === 0) return false
    
    for (var i = 0, item; i < this.items.length; i++) {
      item = this.items[i]
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
  
  function search(needle, stack, compare) {
    var i = 0
      , j = stack.length - 1
      , middle = 0
      , cmp

    while (i <= j) {
      middle = (i + j) >> 1
      cmp = compare(needle, stack[middle])
      
      if (cmp === 0) {
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
    
    return middle
  }
})