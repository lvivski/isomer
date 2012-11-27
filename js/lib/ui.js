define(['util'], function(util) {
  var exports = {}
  
  function UI(options) {
    this.canvas = options.canvas
    this.ctx = this.canvas.getContext('2d')
    this.ctx.webkitspritesmoothingEnabled = false
    
    this.width = canvas.width
    this.height = canvas.height
    
    this.cell = options.cell
    
    this.cx = 0
    this.cy = 0
    
    this.center = { x: 0, y: 0, z: 0 }
    this.projection = this.project(this.center.x, this.center.y, this.center.z)
    
    this.layers = []
    
    this._changed = false
    
    this.init()
  }
  
  exports.create = function create(options) {
    return new UI(options)
  }
  
  UI.prototype.init = function init() {
    var self = this
      , onframe = window.webkitRequestAnimationFrame
                || window.RequestAnimationFrame

    onframe(function render() {
      self.render()
      onframe(render)
    })
  }
  
  UI.prototype.project = function project(x, y, z) {
    return {
      x: Math.round((x - y) * this.cell.width / 2)
    , y: Math.round((1.23 * z + (x + y) / 2) * this.cell.height)
    }
  }
  
  UI.prototype.render = function render() {
    if (!this._changed) return
    this._changed = false
    
    this._timestamp = +new Date
    
    this.ctx.save()
    this.ctx.fillStyle = '#fff'
    this.ctx.fillRect(0, 0, this.width, this.height)
    
    this.cx = Math.round(this.width / 2 - this.projection.x)
    this.cy = Math.round(this.height / 2 - this.projection.y)
      
    for (var i = 0, len = this.layers.length; i < len; i++) {
        this.ctx.save()
        this.ctx.translate(this.cx, this.cy)
        this.layers[i].render(this.ctx)
        this.ctx.restore()
    }

    this.ctx.restore()
  }
  
  UI.prototype.add = function add(item) {
    var layer = this.getLayer(item.x, item.y, item.z)
    if (!layer) return

    layer.add(item)
  }
  
  UI.prototype.getLayer = function layer(x, y, z) {
    for (var i = 0, len = this.layers.length; i < len; i++) {
      if (this.layers[i].contains(x, y, z)) {
        return this.layers[i]
      }
    } 
    return false
  }
  
  UI.prototype.addLayer = function layer(layer) {
    layer.init(this)
    this.layers.push(layer)
  }
  
  UI.prototype.setPlayer = function player(item) {
    this.player = item

    this.layers = []
    this.setCenter(item.x, item.y, item.z)
    this.add(item)
  }
  
  UI.prototype.setCenter = function center(x, y, z) {
    this.center = { x: x, y: y, z: z }
    this.projection = this.project(x, y, z)
    
    if (this.layers.length === 0) {
      this.addLayer(new Layer(this.center))
    }
  }
  
  UI.prototype.handleMove = function move(item) {
    if (this.player === item) {
      this.setCenter(item.x, item.y, item.z)
    }
  }
  
  function Layer(options) {
    this.items = [];
    this.z = options.z;

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
    var item;
    for (var i = 0, len = this.items.length; i < len; i++) {
      item = this.items[i]
      
      ctx.save()
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

    var i = 0,
        j = this.items.length - 1,
        middle = 0;

    while (i <= j) {
      middle = (i + j) >> 1;
      var cmp = Item.compare(item, this.items[middle])

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
  
  exports.Item = Item
  
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
  
  Item.prototype.render = function render(ctx) {
    //
  }
  
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
  
  function Animation(item, props, interval, callback) {
    this.item = item

    this.props = props
    this.sprite = props.sprite
    this.frames = props.frames
    this.startX = this.startY = this.startZ = null
    this.x = this.y = this.z = null
    
    this.start = null
    this.interval = interval

    this.callback = callback
  }

  Animation.prototype.init = function init() {
    if (this.start !== null) return

    this.start = +new Date
    this.x = this.startX = this.item.x
    this.y = this.startY = this.item.y
    this.z = this.startZ = this.item.z

    var names = [ 'x', 'y', 'z' ]
      , name

    for (var i = 0; i < names.length; i++) {
      name = names[i]
      if (this.props.hasOwnProperty(name)) {
        this[name] = this.props[name]
      } else if (this.props.hasOwnProperty('d' + name)) {
        this[name] += this.props['d' + name]
      }
    }
  }

  Animation.prototype.run = function run(timestamp) {
    var percent = (timestamp - this.start) / this.interval
      , frame = Math.round(percent * (this.frames - 1))
    
    this.item.setOffset(this.item.width * frame, this.props.sy)

    this.item.setPosition(this.startX + (this.x - this.startX) * percent,
                          this.startY + (this.y - this.startY) * percent,
                          this.startZ + (this.z - this.startZ) * percent)
  }

  Animation.prototype.end = function end() {
    this.item.setPosition(this.x, this.y, this.z)
    if (this.sprite) this.item.sprite = this.sprite
    if (this.callback) this.callback()
  }
  
  Item.compare = function compare(a, b) {
    if (a.x > b.x || a.y > b.y) return -1
    if (a.x < b.x || a.y < b.y) return 1
  }
  
    
  return exports
})