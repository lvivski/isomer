define(['animation'], function(Animation) {
  
  var abs = Math.abs

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

  Item.prototype.init = function init(layer) {
    this.layer = layer
    this.world = layer.world
    this.position(this.x, this.y, this.z)
    this.offset(this.sx, this.sy)
  }

  Item.prototype.position = function position(x, y, z) {
    this.x = x
    this.y = y
    this.z = z

    this.projection = this.world.project(this.x, this.y, this.z)

    this.world.handleMove(this)
    this.world._changed = true
  }

  Item.prototype.in = function (lx, ly, rx, ry) {
    var w = this.width
      , h = this.height
      , center = this.projection

    return center.x + w >= lx && center.x - w <= rx
        && center.y + h >= ly && center.y - h <= ry
  }

  Item.prototype.offset = function offset(x, y) {
    this.sx = x || 0
    this.sy = y || 0

    this.world._changed = true
  }

  Item.prototype.move = function move(dx, dy, dz) {
    this.position(this.x + dx, this.y + dy, this.z + dz)
  }

  Item.prototype.covers = function covers(item) {
    if (this.z !== item.z || Item.compare(this, item) <= 0 || this === item)
      return false

    var dx = this.projection.x - item.projection.x
      , dy = this.projection.y - item.projection.y
      , radius = dx * dx + dy * dy

    if (radius > 3000)
      return false
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

})