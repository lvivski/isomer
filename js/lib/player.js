define(['util', 'ui'], function(util, ui) {
  var exports = {}
  
  function Player(img) {
    ui.Item.call(this,{
      img: img
    , width: 64
    , height: 64 
    , x: 0
    , y: 0
    , z: 0
    , dx: 0
    , dy: 192
    , frames: 4
    , duration: 0
    })
  }
  
  util.inherits(Player, ui.Item)
  
  exports.create = function(img) {
    return new Player(img)
  }
  
  Player.prototype.command = function command(cmd, msg, callback) {
    if (cmd === 'move') {
      if (msg === 'ne') {
				this.setOffset(0, 0)
        this.setMove(0, -1, 0)
      } else if (msg === 'sw') {
				this.setOffset(0, 192)
        this.setMove(0, 1, 0)
      } else if (msg === 'nw') {
				this.setOffset(0, 128)
        this.setMove(-1, 0, 0)
      } else if (msg === 'se') {
				this.setOffset(0, 64)
        this.setMove(1, 0, 0)
      }
      this.callback = callback || function(){}
			this.setDuration(500)
    } else {
      callback()
      return
    }
  }
  
  Player.prototype.render = function render(ctx) {
    Player.__super__.prototype.render.call(this, ctx)
    
    ctx.drawImage(
        this.img
      , this.dx
      , this.dy
      , this.width
      , this.height
      , this.projection.x - 32
      , this.projection.y - 58
      , this.width
      , this.height
    )
  }
  
  return exports
})