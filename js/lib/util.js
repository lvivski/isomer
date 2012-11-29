define(function() {
  var exports = {}
  function inherits(a, b) {
    a.__super__ = b

    a.prototype = Object.create(b.prototype, {
      constructor: {
        value: a
      , enumerable: false
      , writable: true
      , configurable: true
      }
    })
  }

  exports.inherits = inherits

  return exports
})