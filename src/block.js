function Block(options) {
  Item.call(this, {
    sprite: options.sprite,
    width: options.width,
    height: options.height,
    x: options.x,
    y: options.y,
    z: options.z,
    sx: options.sx || 0,
    sy: options.sy || 0
  })
}

Block.prototype = Object.create(Item.prototype)
Block.prototype.constructor = Block

Block.prototype.render = function render(ctx) {
  ctx.drawImage(
    this.sprite,
    this.sx,
    this.sy,
    this.width,
    this.height,
    this.projection.x - 32,
    this.projection.y - 16,
    this.width,
    this.height
  )
}
