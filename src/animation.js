function Animation(item, props, duration, callback) {
	this.item = item
	this.sprite = props.sprite
	this.frames = props.frames

	this.sy = props.sy

	this.x = props.x | 0
	this.y = props.y | 0
	this.z = props.z | 0

	this.initial = null
	this.start = null
	this.duration = duration || 1

	this.callback = callback
}

Animation.prototype.init = function (tick) {
	if (this.start !== null) return

	this.start = tick

	this.initial = {
		x: this.item.x,
		y: this.item.y,
		z: this.item.z
	}

	if (this.item.world.hasObstacle(this.initial.x + this.x, this.initial.y + this.y, this.initial.z + this.z)) {
		this.x = 0
		this.y = 0
		this.z = 0
	}
}

Animation.prototype.run = function (tick) {
	var percent = (tick - this.start) / this.duration,
	    frame = Math.round(percent * (this.frames - 1))

	this.item.offset(this.item.width * frame, this.sy)
	this.transform(percent)
}

Animation.prototype.transform = function (percent) {
	this.item.position(this.initial.x + this.x * percent,
		this.initial.y + this.y * percent,
		this.initial.z + this.z * percent)
}

Animation.prototype.end = function () {
	this.transform(1)
	if (this.sprite) {
		this.item.sprite = this.sprite
	}
	this.callback && this.callback()
}
