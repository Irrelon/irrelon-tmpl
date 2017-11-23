var Template = function (core, html) {
	this._core = core;
	this._html = html;
	this._renderFunc = core.parse(html);
};

/**
 * Renders the template with the passed data.
 * @param data
 * @returns {*}
 */
Template.prototype.render = function (data) {
	return this._renderFunc(data);
};

/**
 * Data-binds the template on the DOM to the data object passed.
 * @param selector
 * @param data
 */
Template.prototype.link = function (selector, data) {
	// Add this template to the linked views of this data object
	this._core._linkedViews[data] = this._core._linkedViews[data] || [];
	this._core._linkedViews[data].push(this);
};

Template.prototype.updateProperty = function (obj, prop, newVal) {

};

module.exports = Template;