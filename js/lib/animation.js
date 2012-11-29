define(function() {

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

    for (var i = 0, len = names.length, name; i < names.length; i++) {
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

    if (percent < 0)
      percent = 0

    this.item.offset(this.item.width * frame, this.props.sy)

    this.item.position( this.startX + (this.x - this.startX) * percent
                      , this.startY + (this.y - this.startY) * percent
                      , this.startZ + (this.z - this.startZ) * percent )
  }

  Animation.prototype.end = function end() {
    this.item.position(this.x, this.y, this.z)
    if (this.sprite) this.item.sprite = this.sprite
    this.callback && this.callback()
  }

  return Animation

})