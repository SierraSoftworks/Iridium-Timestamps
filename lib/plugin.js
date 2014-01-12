module.exports = {
	newModel: onNewModel,
	validate: onValidating
};

var defaultOptions = {
	createdProperty: 'createdOn',
	modifiedProperty: 'modifiedOn',
	now: function() { return new Date(); },
	persist: true
};

function onNewModel(db, collection, schema, options) {
	if(options.timestamps) {
		var config = extend(options.timestamps, defaultOptions);

		if(config.createdProperty && config.persist)
			schema[config.createdProperty] = schema[config.createdProperty] || 'readonly';
		if(config.modifiedProperty && config.persist)
			schema[config.modifiedProperty] = schema[config.modifiedProperty] || 'readonly';

		if(this.persist) {
			var creatingHook = function(done) {
				if(!this.persist) return done();

				if(config.createdProperty)
					this[config.createdProperty] = config.now();
				if(config.modifiedProperty)
					this[config.modifiedProperty] = config.now();

				done();
			};

			var savingHook = function(changes, done) {
				if(config.modifiedProperty) {
					changes.$set = changes.$set || {};
					changes.$set[modifiedProperty] = config.now();
				}

				done();
			};

			if(model.hooks.creating) {
				if(model.hooks.creating.length === 1) {
					var next = model.hooks.creating;
					model.hooks.creating = function(done) {
						creatingHook.call(this, function(err) {
							if(err) return done(err);
							next.call(this, done);
						});
					}
				}
			} else model.hooks.creating = creatingHook;

			if(model.hooks.saving) {
				if(model.hooks.saving.length === 1) {
					var next = model.hooks.saving;
					model.hooks.saving = function(changes, done) {
						savingHook.call(this, changes, function(err) {
							if(err) return done(err);
							next.call(this, changes, done);
						});
					}
				}
			} else model.hooks.saving = savingHook;
		} else {
			this.on('ready', function(instance) {
				if(config.createdProperty) {
					instance.__state.timestamps_creationTime = config.now();
					Object.defineProperty(instance, config.createdProperty, {
						get: function() { return this.__state.timestamps_creationTime; }
					});
				}

				if(config.modifiedProperty) {
					instance.__state.timestamps_modifiedTime = config.now();
					Object.defineProperty(instance, config.modifiedProperty, {
						get: function() { return this.__state.timestamps_modifiedTime; }
					});
				}
			});

			this.on('saving', function(instance, changes) {
				if(config.modifiedProperty)
					instance.__state.timestamps_modifiedTime = config.now();
			});
		}
	}
};

function onValidating(schema, value, propertyName) {
	if(schema == 'readonly') return this.fail('no changes', 'a new value');
}

function extend(original, update) {
	if(typeof update == 'undefined') return original;

	var union = {};
	for(var k in original) {
		union[k] = update[k] !== undefined ? update[k] : original[k];
	}

	return union;
}