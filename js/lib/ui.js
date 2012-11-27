define(['util'], function(util) {
  var exports = {}
  
  function UI(options) {
    this.canvas = options.canvas
    this.ctx = this.canvas.getContext('2d')
    this.ctx.webkitspritesmoothingEnabled = false;
    
    this.width = canvas.width
    this.height = canvas.height
    
    this.cell = options.cell
    
    this.center = { x: 0, y: 0, z: 0 }
    this.projection = this.project(this.center.x, this.center.y, this.center.z)
    
    this.layers = []
    
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
    
    this.ctx.save()
    this.ctx.fillStyle = '#fff'
    this.ctx.fillRect(0, 0, this.width, this.height)
    
    this.cx = Math.round(this.width / 2 - this.projection.x)
    this.cy = Math.round(this.height / 2 - this.projection.y)
      
    for (var i = 5; i >= -5; i--) {
      if (i > 0) {
        this.ctx.fillStyle = 'rgba(0,0,0,0.4)'
        this.ctx.fillRect(0, 0, this.width, this.height)
      }
      for (var j = 0; j < this.layers.length; j++) {
        this.ctx.save()
        this.ctx.translate(this.cx, this.cy)
        this.layers[j].render(this.ctx)
        this.ctx.restore()
      }
    }

    this.ctx.restore()
  }
  
  UI.prototype.add = function add(item) {
    var layer = this.getLayer(item.x, item.y, item.z)
    if (!layer) return

    layer.add(item)
  }
  
  UI.prototype.getLayer = function layer(x, y, z) {
    for (var i = 0; i < this.layers.length; i++) {
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
    this.img = options.img
    this.width = options.width
    this.height = options.height
    
    this.x = options.x
    this.y = options.y
    this.z = options.z
    
    this.dx = options.dx
    this.dy = options.dy
    
    this.setFrames(options.frames)
    this.setDuration(options.duration)
    
    this.updateFtime()
  }
  
  exports.Item = Item
  
  Item.prototype.init = function init(layer) {
    this.layer = layer
    this.ui = layer.ui
    this.setPosition(this.x, this.y, this.z)
    this.setOffset(this.dx, this.dy)
  }
  
  Item.prototype.setPosition = function position(x, y, z) {
    this.x = x || 0
    this.y = y || 0
    this.z = z || 0
    
    this.ui.handleMove(this)
    
    this.projection = this.ui.project(this.x, this.y, this.z)
    
    this.ui._changed = true
  }
  
  Item.prototype.move = function move(cx, cy, cz) {
    this.setPosition(this.x + cx, this.y + cy, this.z + cz)
  }
  
  Item.prototype.setMove = function move(cx, cy, cz) {
    this.cx = cx
    this.cy = cy
    this.cz = cz
  }
  
  Item.prototype.updateFtime = function ftime() {
    if (this.duration > 0 && this.frames > 0)
      this.ftime = +new Date + (this.duration / this.frames)
    else
      this.ftime = 0
  }
  
  Item.prototype.setFrames = function frames(frames) {
    this.currentFrame = 0
    this.frames = frames || 1
  }
  
  Item.prototype.setOffset = function offset(x, y) {
    this.dx = x || 0
    this.dy = y || 0
    
    this.ui._changed = true
  }
  
  Item.prototype.setDuration = function duration(duration) {
    this.duration = duration
  }
  
  Item.prototype.nextFrame = function next() {
    if (this.duration) {
      this.updateFtime()
      if (this.cx || this.cy || this.cz) {
        this.move(
          this.cx / this.frames
        , this.cy / this.frames
        , this.cz / this.frames
        )
      }
      
      this.dx = this.width * this.currentFrame
    
      if (this.currentFrame === (this.frames - 1)) { // frames end
        this.currentFrame = 0
        this.cx = this.cy = this.cz = 0
        this.duration = 0
        this.callback()
      } else {
        ++this.currentFrame
      } 
    }
  }
  
  Item.prototype.render = function render(ctx) {
    if (this.duration) this.ui._changed = true
    this.animate()
  }
  
  Item.prototype.animate = function animate() {
    if ((+ new Date) > this.ftime) {
      this.nextFrame()
    }
  }
  
  Item.compare = function compare(a, b) {
    if (a.x > b.x || a.y > b.y) return -1
    if (a.x < b.x || a.y < b.y) return 1
  }
  
    
  return exports
})