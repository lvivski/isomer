define(['util', 'item'], function(util, Item) {

  function Player(sprite) {
    Item.call(this,{
      sprite: sprite
    , width: 64
    , height: 64
    , x: 0
    , y: 0
    , z: 1
    , sx: 0
    , sy: 192
    })

    this._visible = true
  }

  util.inherits(Player, Item)

  Player.prototype.command = function command(cmd, options, callback) {
    if (cmd === 'move') {
      var sy = 0
      if (options.dy > 0)
        sy = 192
      else if (options.dx > 0)
        sy = 64
      else if (options.dx < 0)
        sy = 128
      this.animate({ dx: options.dx, dy: options.dy, dz: options.dz, sy: sy, frames: 4}, 300, callback)
    } else {
      callback()
    }
  }

  Player.prototype.render = function render(ctx) {
    ctx.drawImage(
        this.sprite
      , this.sx
      , this.sy
      , this.width
      , this.height
      , this.projection.x - 32
      , this.projection.y - 24
      , this.width
      , this.height
    )
  }
  
  Player.prototype.animate = function animate(props, interval, callback) {
    if (this.layer.contains(this.x + props.dx, this.y + props.dy, this.z + props.dz)) {
      props.dx = props.dy = props.dz = 0
    }
    Player.__super__.prototype.animate.call(this, props, interval, callback)
  }

  return Player

})