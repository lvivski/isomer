define(['item'], function(Item) {
  
  function Layer(z) {
    this.items = []
    this.z = z

    this.map = {}

    this.ui = null
  }
  
  Layer.prototype.init = function init(ui) {
    this.ui = ui
  }
  
  Layer.prototype.has = function has(item) {
    return this.contains(item.x, item.y, item.z)
  }

  Layer.prototype.contains = function contains(x, y, z) {
    return this.z === z
  }
  
  Layer.prototype.render = function render(ctx) {
    var item
    for (var i = 0, len = this.items.length; i < len; i++) {
      item = this.items[i]
      if (!item._visible && !item.neighbors(this.ui.player)) {
	continue
      } else {
	item._visible = true
      }
      ctx.save()
      if (item.covers(this.ui.player)) {
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