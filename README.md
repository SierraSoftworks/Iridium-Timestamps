## Iridium Modification Timestamps
This plugin adds the ability to keep track of `createdOn` and `modifiedOn` properties on models defined using [Iridium][iridium], a high performance MongoDB ODM.

<a href="https://npmjs.org/package/iridium-timestamps"><img src="https://badge.fury.io/js/iridium-timestamps.png" alt="" style="max-width:100%;"></a>

## Install
```
npm install iridium-timestamps
```

## Dependencies
You'll need [Iridium][iridium] to use this plugin, but other than that there are no external dependencies.

## Example
```javascript
var iridium = require('iridium'),
    modts = require('iridium-timestamps');

iridium.register(modts);

module.exports = function(db) {
	var schema = {

	};

	var options = {
		timestamps: {
			createdProperty: 'createdOn',
			modifiedProperty: 'modifiedOn',
			now: function() { return new Date(); },
			persist: true
		}
	};
};
```

## Options
- `createdProperty` **string|false** 
  Determines the name of the property use to store the created timestamp (default `"createdOn"`). If set to `false`, disables this property.
- `modifiedProperty` **string|false** 
  Determines the name of the property used to store the modified timestamp (default `"modifiedOn"`). If set to `false`, disables this property.
- `now` **function**
  Allows you to specify a custom function used to set the current time data for the database (default `function() { return new Date(); }`).
- `persist` **boolean**
  Used to prevent creation and modification timestamps from being stored in the database (default `true`). If you set this to false, be aware that `"createdOn"` will reflect the time at which the instance was retrieved from the database.

## Features
- Easy to add created and modified date/time information to your models
- Highly customizable
- Supports existing creating and saving hooks through the use of a robust wrapper function
- Allows values to be stored "in-memory" if usage scenarios don't require them to be stored in the database.

[iridium]: https://github.com/SierraSoftworks/Iridium