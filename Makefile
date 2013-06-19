JS_COMPILER ?= ./node_modules/uglify-js/bin/uglifyjs
FILES = \
	src/sprites.js \
	src/layer.js \
	src/world.js \
	src/item.js \
	src/block.js \
	src/player.js \
	src/animation.js \

all: \
	isomer.js \
	isomer.min.js

isomer.js: ${FILES}
	@rm -f $@
# @echo "(function(){" > $@.tmp
# @echo "'use strict'" >> $@.tmp
	@cat $(filter %.js,$^) >> $@.tmp
# @echo "}())" >> $@.tmp
	@$(JS_COMPILER) $@.tmp -b indent-level=2 -o $@
	@rm $@.tmp
	@chmod a-w $@

isomer.min.js: isomer.js
	@rm -f $@
	@$(JS_COMPILER) $< -c -m -o $@ \
		--source-map $@.map \
		&& du -h $< $@

deps:
	mkdir -p node_modules
	npm install

clean:
	rm -f isomer*.js*
