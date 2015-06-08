define('bigba:static/utils/LocalDataCenter.js', function(require, exports, module){ var store = require("bigba:static/utils/store.js"),
    util = require("bigba:static/util.js");

module.exports = {
	eLength: 5,
	schema: ["address", "lat", "lng"],
	key: "LocalDataCenter",
	/**
	 * Add new item to localStorage, the item info is based on the url which contains "address&lat&lng".
	 * @param {Object} params  Item information, use "util.getParams()"" to create one
	 */
	add: function(params) {
		var me = this,
			allE = store.get(me.key) || [];
		// If valid
		if (!me._validate(params)) {
			return;
		}
		params.address = encodeURIComponent(util.encodeHTML(decodeURIComponent(params.address)));
		// If params has been stored
		for (var i in allE) {
			var el = allE[i];
			if (me._equal(params, el)) {
				return;
			}
		}
		allE.unshift(params);
		allE = me._cut(allE);
		store.set(me.key, allE);
	},
	/**
	 * Get all the stored items from localstorage with the limited length of "this.eLength"
	 * @return {Array}  All stored items 
	 */
	getAll: function() {
		return this._cut(store.get(this.key));
	},
	/**
	 * Check if "obj" is valid using "this.schema"
	 * @private
	 * @param  {Object}  obj  
	 * @return {Boolean}  Return true if "obj" is valid and vice versa
	 */
	_validate: function(obj){
		var result = true;
		for (var i in this.schema) {
			result = result && obj[this.schema[i]];
		}
		return result;
	},
	/**
	 * Keep the "allE" with the length of "this.eLength"
	 * @private
	 * @param  {Array} allE  Input array
	 * @return {Array}       Output array
	 */
	_cut: function(allE){
		while (allE && allE.length > this.eLength) {
			allE.pop();
		}
		return allE;
	},
	/**
	 * Check whether too objects equal each other on "this.schema"
	 * @private
	 * @param  {Object} a 
	 * @param  {Object} b 
	 * @return {Boolean}   Return true if a equals b and vice versa
	 */
	_equal: function(a, b) {
		return a && b && this._serialize(a) === this._serialize(b);
	},
	/**
	 * Serialize "el" on the basis of "this.schema"
	 * @private
	 * @param  {Object} el Input object
	 * @return {String}    Output String
	 */
	_serialize: function(el) {
		var result = '';
		for (var i in el) {
			if (el.hasOwnProperty(i)) {
				result += el[i];
			}
		}
		return result;
	}
}; 
});