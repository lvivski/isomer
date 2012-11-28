define(['util', 'item'], function(util, Item) {
  
  function Block(options) {
    Item.call(this,{
      sprite: options.sprite
    , width: options.width
    , height: options.height
    , x: options.x
    , y: options.y
    , z: options.z
    })
  }
  
  util.inherits(Block, Item)
  
  Block.prototype.render = function render(ctx) {
    ctx.drawImage(
        this.sprite
      , this.projection.x - 32
      , this.projection.y - 16
      , this.width
      , this.height
    )
  }
  
  return Block
  
})