function Sprites(urls) {
  this.urls = urls;
}

Sprites.prototype.load = function(callback) {
  var ids = Object.keys(this.urls), length = ids.length, sprites = {};
  ids.forEach(function(id) {
    var img = new Image();
    img.onload = function() {
      sprites[id] = this;
      if (--length === 0) {
        callback(sprites);
      }
    };
    img.src = this.urls[id];
  }, this);
};

function Layer(z) {
  this.items = [];
  this.z = z;
  this.map = {};
  this.world = null;
}

Layer.prototype.init = function(world) {
  this.world = world;
  this.ctx = world.ctx;
};

Layer.prototype.has = function(item) {
  return this.items.indexOf(item) >= 0;
};

Layer.prototype.render = function(tick) {
  var lx = -this.world.cx, rx = -this.world.cx + this.world.width, ly = -this.world.cy, ry = -this.world.cy + this.world.height;
  for (var i = 0, len = this.items.length; i < len; i++) {
    var item = this.items[i];
    if (!item.in(lx, ly, rx, ry)) continue;
    if (!item._discovered && !item.neighbors(this.world.player)) {
      continue;
    } else {
      item._discovered = true;
    }
    this.ctx.globalAlpha = 1;
    if (item.covers(this.world.player)) {
      this.ctx.globalAlpha = .6;
    }
    item.render(tick);
    item.animation(tick);
  }
};

Layer.prototype.add = function(item) {
  item.init(this);
  this.insert(item);
};

Layer.prototype.insert = function(item) {
  if (this.items.length === 0) {
    this.items.push(item);
    return;
  }
  var pos = Layer.search(item, this.items, Item.compare);
  this.items.splice(pos, 0, item);
};

Layer.prototype.get = function(x, y, z) {
  if (this.items.length === 0) return false;
  for (var i = 0; i < this.items.length; ++i) {
    var item = this.items[i];
    if (x === item.x && y === item.y && z === item.z) return item;
  }
  return false;
};

Layer.prototype.remove = function(item) {
  var index = this.items.indexOf(item);
  if (index !== -1) this.items.splice(index, 1);
};

Layer.prototype.sort = function() {
  this.items = this.items.sort(Item.compare);
};

Layer.compare = function(a, b) {
  if (a.z > b.z) return -1;
  if (a.z < b.z) return 1;
  return 0;
};

Layer.search = function(needle, stack, comparator) {
  var i = 0, j = stack.length - 1, middle = 0;
  while (i <= j) {
    middle = i + j >> 1;
    var cmp = comparator(stack[middle], needle);
    if (cmp < 0) {
      i = middle + 1;
    } else if (cmp > 0) {
      j = middle - 1;
    } else {
      break;
    }
  }
  if (cmp < 0) {
    middle++;
  }
  return middle;
};

function World(options) {
  this.canvas = options.canvas;
  this.ctx = this.canvas.getContext("2d");
  this.ctx.webkitspritesmoothingEnabled = false;
  this.width = canvas.width;
  this.height = canvas.height;
  this.cell = options.cell;
  this.cx = 0;
  this.cy = 0;
  this.center = {
    x: 0,
    y: 0,
    z: 0
  };
  this.projection = this.project(this.center.x, this.center.y, this.center.z);
  this.layers = [];
  this._changed = false;
  this.init();
}

World.prototype.init = function() {
  var self = this, onframe = window.webkitRequestAnimationFrame || window.RequestAnimationFrame;
  onframe(function render(tick) {
    self.render(tick);
    onframe(render);
  });
};

World.prototype.project = function(x, y, z) {
  return {
    x: Math.round((x - y) * this.cell.width / 2),
    y: Math.round(((x + y) / 2 - z) * this.cell.height)
  };
};

World.prototype.render = function(tick) {
  if (!this._changed) return;
  this._changed = false;
  this.cx = Math.round(this.width / 2 - this.projection.x);
  this.cy = Math.round(this.height / 2 - this.projection.y);
  this.ctx.save();
  this.ctx.clearRect(0, 0, this.width, this.height);
  this.ctx.translate(this.cx, this.cy);
  for (var i = 0, len = this.layers.length; i < len; i++) {
    Math.random() > .75 && this.layers[i].sort();
    this.layers[i].render(tick);
  }
  this.ctx.restore();
};

World.prototype.add = function(item) {
  var layer = this.getLayer(item);
  if (!layer) return;
  layer.add(item);
};

World.prototype.getLayer = function(item) {
  for (var i = 0, len = this.layers.length; i < len; i++) {
    if (this.layers[i].z === item.z) {
      return this.layers[i];
    }
  }
  return false;
};

World.prototype.addLayer = function(layer) {
  layer.init(this);
  this.layers.push(layer);
};

World.prototype.setPlayer = function(item) {
  this.player = item;
  this.layers = [];
  this.setCenter(item.x, item.y, item.z);
  this.add(item);
};

World.prototype.setCenter = function(x, y, z) {
  this.center = {
    x: x,
    y: y,
    z: z
  };
  this.projection = this.project(x, y, z);
  if (this.layers.length === 0) {
    this.addLayer(new Layer(this.player.z - 1));
    this.addLayer(new Layer(this.player.z));
  }
};

World.prototype.handleMove = function(item) {
  if (this.player === item) {
    this.setCenter(item.x, item.y, item.z);
  }
};

function Item(options) {
  this.sprite = options.sprite;
  this.width = options.width;
  this.height = options.height;
  this.x = options.x;
  this.y = options.y;
  this.z = options.z;
  this.sx = options.sx;
  this.sy = options.sy;
  this.animations = [];
  this._discovered = false;
}

Item.prototype.init = function(layer) {
  this.layer = layer;
  this.world = layer.world;
  this.ctx = layer.ctx;
  this.position(this.x, this.y, this.z);
  this.offset(this.sx, this.sy);
};

Item.prototype.position = function(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.projection = this.world.project(this.x, this.y, this.z);
  this.world.handleMove(this);
  this.world._changed = true;
};

Item.prototype.in = function(lx, ly, rx, ry) {
  var w = this.width, h = this.height, center = this.projection;
  return center.x + w >= lx && center.x - w <= rx && center.y + h >= ly && center.y - h <= ry;
};

Item.prototype.offset = function(x, y) {
  this.sx = x || 0;
  this.sy = y || 0;
  this.world._changed = true;
};

Item.prototype.move = function(dx, dy, dz) {
  this.position(this.x + dx, this.y + dy, this.z + dz);
};

Item.prototype.covers = function(item) {
  if (this.z !== item.z || Item.compare(this, item) <= 0 || this === item) return false;
  var dx = this.projection.x - item.projection.x, dy = this.projection.y - item.projection.y, dist = dx * dx + dy * dy;
  if (dist < 3e3) return true;
};

Item.prototype.neighbors = function(item) {
  var dx = this.x - item.x, dy = this.y - item.y, dist = dx * dx + dy * dy;
  if (dist < 9) return true;
};

Item.prototype.render = function(tick) {};

Item.prototype.animate = function(props, interval, callback) {
  this.animations.push(new Animation(this, props, interval, callback));
  this.world._changed = true;
};

Item.prototype.animation = function(tick) {
  if (this.animations.length === 0) return;
  while (this.animations.length !== 0) {
    var first = this.animations[0];
    first.init(tick);
    if (first.start + first.interval <= tick) {
      this.animations.shift();
      first.end();
      this.world._changed = true;
      continue;
    }
    first.run(tick);
    this.world._changed = true;
    break;
  }
};

Item.prototype.reset = function() {
  if (this.animation.length === 0) return;
  for (var i = 0, len = this.animation.length; i < len; i++) {
    var a = this.animation[i];
    a.init();
    a.end();
  }
  this.animation = [];
};

Item.prototype.remove = function() {
  this.layer.remove(this);
};

Item.compare = function compare(a, b) {
  return a.x + a.y - b.x - b.y;
};

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
  });
}

Block.prototype = Object.create(Item.prototype);

Block.prototype.constructor = Block;

Block.prototype.render = function render(tick) {
  this.ctx.drawImage(this.sprite, this.sx, this.sy, this.width, this.height, this.projection.x - 32, this.projection.y - 16, this.width, this.height);
};

function Player(sprite) {
  Item.call(this, {
    sprite: sprite,
    width: 64,
    height: 64,
    x: 0,
    y: 0,
    z: 1,
    sx: 0,
    sy: 192
  });
  this._discovered = true;
}

Player.prototype = Object.create(Item.prototype);

Player.prototype.constructor = Player;

Player.prototype.command = function(cmd, options, callback) {
  if (cmd === "move") {
    var sy = 0;
    if (options.y > 0) sy = 192; else if (options.x > 0) sy = 64; else if (options.x < 0) sy = 128;
    this.animate({
      x: options.x,
      y: options.y,
      z: options.z,
      sy: sy,
      frames: 4
    }, 300, callback);
  } else {
    callback();
  }
};

Player.prototype.render = function() {
  this.ctx.drawImage(this.sprite, this.sx, this.sy, this.width, this.height, this.projection.x - 32, this.projection.y - 24, this.width, this.height);
};

function Animation(item, props, interval, callback) {
  this.item = item;
  this.sprite = props.sprite;
  this.frames = props.frames;
  this.sy = props.sy;
  this.x = props.x | 0;
  this.y = props.y | 0;
  this.z = props.z | 0;
  this.initial = null;
  this.start = null;
  this.interval = interval || 1;
  this.callback = callback;
}

Animation.prototype.init = function(tick) {
  if (this.start !== null) return;
  this.start = tick;
  this.initial = {
    x: this.item.x,
    y: this.item.y,
    z: this.item.z
  };
  if (this.item.layer.get(this.initial.x + this.x, this.initial.y + this.y, this.initial.z + this.z)) {
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }
};

Animation.prototype.run = function(tick) {
  var percent = (tick - this.start) / this.interval, frame = Math.round(percent * (this.frames - 1));
  this.item.offset(this.item.width * frame, this.sy);
  this.transform(percent);
};

Animation.prototype.transform = function(percent) {
  this.item.position(this.initial.x + this.x * percent, this.initial.y + this.y * percent, this.initial.z + this.z * percent);
};

Animation.prototype.end = function() {
  this.transform(1);
  if (this.sprite) {
    this.item.sprite = this.sprite;
  }
  this.callback && this.callback();
};