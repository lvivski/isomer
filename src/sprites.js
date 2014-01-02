function Sprites(urls) {
	this.urls = urls;
}

Sprites.prototype.load = function (callback) {
	var ids = Object.keys(this.urls),
		length = ids.length,
		sprites = {};

	ids.forEach(function (id) {
		var img = new Image()

		img.onload = function () {
			sprites[id] = this
			if (--length === 0) {
				callback(sprites)
			}
		}

		img.src = this.urls[id]
	}, this)
}
