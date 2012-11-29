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

    this.animation = []

    this._visible = false
  }

  Item.prototype.init = function init(layer) {
    this.layer = layer
    this.ui = layer.ui
    this.setPosition(this.x, this.y, this.z)
    this.setOffset(this.sx, this.sy)
  }

  Item.prototype.setPosition = function position(x, y, z) {
    this.x = x || 0
    this.y = y || 0
    this.z = z || 0

    this.ui.handleMove(this)

    this.projection = this.ui.project(this.x, this.y, this.z)

    this.ui._changed = true
  }

  Item.prototype.setOffset = function offset(x, y) {
    this.sx = x || 0
    this.sy = y || 0

    this.ui._changed = true
  }

  Item.prototype.move = function move(cx, cy, cz) {
    this.setPosition(this.x + cx, this.y + cy, this.z + cz)
  }

  Item.prototype.render = function render(ctx) {}

  Item.prototype.postRender = function postRender() {
    if (this.animation.length === 0) return

    while (this.animation.length !== 0) {
      var first = this.animation[0]
      first.init()

      if (first.start + first.interval <= this.ui._timestamp) {
        this.animation.shift()
        first.end()
        this.ui._changed = true
        continue
      }

      first.run(this.ui._timestamp)
      this.ui._changed = true
      break
    }
  }

  Item.prototype.animate = function animate(props, interval, callback) {
    this.animation.push(new Animation(this, props, interval, callback))
    this.ui._changed = true
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

  Item.prototype.covers = function covers(item) {
    if (this === item) return false
    if (this.z === item.z
      && (
        (this.x >= item.x && this.y >= item.y
        && abs(this.x - item.x) < 2 && abs(this.y - item.y) < 2)
        || (item.y > this.y && (this.x - item.x === 1 || this.x === item.x) && item.y - this.y < 1)
        || (item.x > this.x && (this.y - item.y === 1 || this.y === item.y) && item.x - this.x < 1))
      )
      return true
  }

  Item.prototype.neighbors = function neighbors(item) {
    if (abs(this.z - item.z) < 3 && abs(this.x - item.x) < 3 && abs(this.y - item.y) < 3)
      return true
  }

  Item.compare = function compare(a, b) {
    return a.x + a.y - b.x - b.y
  }

  return Item

  function abs(x) {
    return Math.abs(x)
  }

})