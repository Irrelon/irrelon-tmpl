var Template = function (core, html) {
	this._core = core;
	this._html = html;
	this._renderFunc = core.parse(html);
};

Template.prototype.render = function (data) {
	return this._renderFunc(data);
};

module.exports = Template;