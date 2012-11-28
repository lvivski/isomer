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

    for (var i = 0, len = this.animation.length; i < len; i++) {
      var a = this.animation[i]
      a.init()
      a.end()
    }
    this.animation = []
  }
  
  Item.compare = function compare(a, b) {
    if (a.x > b.x || a.y > b.y) return -1
    if (a.x < b.x || a.y < b.y) return 1
  }
  
  return Item

})