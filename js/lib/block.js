define(['util', 'ui'], function(util, ui) {
  var exports = {}
  
  function Block(options) {
    ui.Item.call(this,{
      img: options.img
    , width: options.width
    , height: options.height
    , x: options.x
    , y: options.y
    , z: options.z
    , duration: 0
    })
  }
  
  util.inherits(Block, ui.Item)
  
  exports.create = function(options) {
    return new Block(options)
  }
  
  Block.prototype.render = function render(ctx) {
    //Block.__super__.prototype.render.call(this, ctx)
    
    ctx.drawImage(
        this.img
      , this.projection.x - 32
      , this.projection.y - 16
      , this.width
      , this.height
    )
  }
  
  return exports
})