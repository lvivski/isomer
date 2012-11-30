define(['animation'], function(Animation) {

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

    this._visible = false
  }

  Item.prototype.init = function init(layer) {
    this.layer = layer
    this.world = layer.world
    this.position(this.x, this.y, this.z)
    this.offset(this.sx, this.sy)
  }

  Item.prototype.position = function position(x, y, z) {
    this.x = x || 0
    this.y = y || 0
    this.z = z || 0

    this.world.handleMove(this)

    this.projection = this.world.project(this.x, this.y, this.z)

    this.world._changed = true
  }

  Item.prototype.offset = function offset(x, y) {
    this.sx = x || 0
    this.sy = y || 0

    this.world._changed = true
  }

  Item.prototype.move = function move(cx, cy, cz) {
    this.position(this.x + cx, this.y + cy, this.z + cz)
  }
  
  Item.prototype.covers = function covers(item) {
    if (Item.compare(this, item) <= 0 || this === item) return false
    if (this.z === item.z
      && (
	      (this.x >= item.x && this.y >= item.y && this.x - item.x < 2 && this.y - item.y < 2)
        || (item.y > this.y && (this.x - item.x === 1 || this.x === item.x) && item.y - this.y < 1)
        || (item.x > this.x && (this.y - item.y === 1 || this.y === item.y) && item.x - this.x < 1))
      )
      return true
  }

  Item.prototype.neighbors = function neighbors(item) {
    if (abs(this.x - item.x) < 3 && abs(this.y - item.y) < 3)
      return true
  }

  Item.prototype.render = function render(ctx) {}

  Item.prototype.animate = function animate(props, interval, callback) {
    this.animations.push(new Animation(this, props, interval, callback))
    this.world._changed = true
  }
  
  Item.prototype.animation = function animation() {
    if (this.animations.length === 0) return

    while (this.animations.length !== 0) {
      var first = this.animations[0]
      first.init()

      if (first.start + first.interval <= Date.now()) {
        this.animations.shift()
        first.end()
        this.world._changed = true
        continue
      }

      first.run()
      this.world._changed = true
      break
    }
  }

  Item.prototype.reset = function reset() {
    if (this.animation.length === 0) return

    for (var i = 0, len = this.animation.length, a; i < len; i++) {
      a = this.animation[i]
      a.init()
      a.end()
    }
    this.animation = []
  }
  
  Item.prototype.remove = function remove() {
    this.layer.remove(this)
  }

  Item.compare = function compare(a, b) {
    return a.x + a.y - b.x - b.y
  }

  return Item

  function abs(x) {
    return Math.abs(x)
  }

})