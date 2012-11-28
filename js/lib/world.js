define(['layer'], function(Layer) {
  
  function World(options) {
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
  
  World.prototype.init = function init() {
    var self = this
      , onframe = window.webkitRequestAnimationFrame
                || window.RequestAnimationFrame

    onframe(function render() {
      self.render()
      onframe(render)
    })
  }
  
  World.prototype.project = function project(x, y, z) {
    return {
      x: Math.round((x - y) * this.cell.width / 2)
    , y: Math.round((-1 * z + (x + y) / 2) * this.cell.height)
    }
  }
  
  World.prototype.render = function render() {
    if (!this._changed) return
    this._changed = false
    
    this._timestamp = +new Date
    
    this.ctx.save()
    this.ctx.fillStyle = '#fff'
    this.ctx.fillRect(0, 0, this.width, this.height)
    
    this.cx = Math.round(this.width / 2 - this.projection.x)
    this.cy = Math.round(this.height / 2 - this.projection.y)
      
    for (var i = 0, len = this.layers.length; i < len; i++) {
      this.layers[i].sort()
      this.ctx.save()
      this.ctx.translate(this.cx, this.cy)
      this.layers[i].render(this.ctx)
      this.ctx.restore()
    }

    this.ctx.restore()
  }
  
  World.prototype.add = function add(item) {
    var layer = this.getLayer(item.x, item.y, item.z)
    if (!layer) return

    layer.add(item)
  }
  
  World.prototype.getLayer = function layer(x, y, z) {
    for (var i = 0, len = this.layers.length; i < len; i++) {
      if (this.layers[i].contains(x, y, z)) {
        return this.layers[i]
      }
    } 
    return false
  }
  
  World.prototype.addLayer = function layer(layer) {
    layer.init(this)
    this.layers.push(layer)
  }
  
  World.prototype.setPlayer = function player(item) {
    this.player = item

    this.layers = []
    this.setCenter(item.x, item.y, item.z)
    this.add(item)
  }
  
  World.prototype.setCenter = function center(x, y, z) {
    this.center = { x: x, y: y, z: z }
    this.projection = this.project(x, y, z)
    
    if (this.layers.length === 0) {
      this.addLayer(new Layer(0))
      this.addLayer(new Layer(1))
    }
  }
  
  World.prototype.handleMove = function move(item) {
    if (this.player === item) {
      this.setCenter(item.x, item.y, item.z)
    }
  }
  
  return World
  
})