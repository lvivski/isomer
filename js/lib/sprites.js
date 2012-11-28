define(function() {
  var exports = {}

  var urls = {
        player: 'img/player.png'
      , blocks: 'img/blocks.png'
      }
    , ids = Object.keys(urls)
    , sprites = {}

  var length = ids.length
  
  ids.forEach(function(id) {
    var img = new Image()

    img.onload = function onload() {
      sprites[id] = this
      if (--length === 0) return finish()
    }
    
    img.src = urls[id]
  })
  
  var loaded = false
    , callbacks = []
  
  function finish() {
    loaded = true
    
    callbacks.forEach(function(callback) {
      callback(sprites)
    })
    
    callbacks = null
  };

  exports.load = function load(callback) {
    if (loaded) return callback(sprites)

    callbacks.push(callback)
  }

  return exports
})
