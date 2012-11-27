define(['util', 'ui'], function(util, ui) {
  var exports = {}
  
  function Block(options) {
    ui.Item.call(this,{
      sprite: options.sprite
    , width: options.width
    , height: options.height
    , x: options.x
    , y: options.y
    , z: options.z
    })
  }
  
  util.inherits(Block, ui.Item)
  
  exports.create = function(options) {
    return new Block(options)
  }
  
  Block.prototype.render = function render(ctx) {
    ctx.drawImage(
        this.sprite
      , this.projection.x - 32
      , this.projection.y - 16
      , this.width
      , this.height
    )
  }
  
  return exports
})