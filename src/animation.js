function Animation(item, props, interval, callback) {
  this.item = item

  this.props = props
  this.sprite = props.sprite
  this.frames = props.frames
  this.startX = this.startY = this.startZ = null
  this.x = this.y = this.z = null

  this.start = null
  this.interval = interval || 1

  this.callback = callback
}

Animation.prototype.init = function () {
  if (this.start !== null) return

  this.start = Date.now()
  this.x = this.startX = this.item.x
  this.y = this.startY = this.item.y
  this.z = this.startZ = this.item.z

  var names = ['x', 'y', 'z']

  for (var i = 0; i < names.length; ++i) {
    var name = names[i]
    if (this.props[name] !== undefined) {
      this[name] = this.props[name]
    } else if (this.props['d' + name] !== undefined) {
      this[name] += this.props['d' + name]
    }
  }

  if (this.item.layer.get(this.x, this.y, this.z)) {
    this.x = this.startX
    this.y = this.startY
    this.z = this.startZ
  }
}

Animation.prototype.run = function () {
  var percent = (Date.now() - this.start) / this.interval,
      frame = Math.round(percent * (this.frames - 1))

  if (percent < 0)
    percent = 0

  this.item.offset(this.item.width * frame, this.props.sy)

  this.item.position(this.startX + (this.x - this.startX) * percent,
    this.startY + (this.y - this.startY) * percent,
    this.startZ + (this.z - this.startZ) * percent)
}

Animation.prototype.end = function () {
  this.item.position(this.x, this.y, this.z)
  if (this.sprite) this.item.sprite = this.sprite
  this.callback && this.callback()
}
