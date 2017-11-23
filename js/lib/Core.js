var Template = require('./Template');

var Core = function (html, data) {
	this._linkedViews = {};

	if (html !== undefined) {
		if (data !== undefined) {
			// Return a rendered template
			return this.render(html, data);
		}

		return this.template(html);
	}
};

Core.prototype.custom = {};

Core.prototype.code = function (html) {
	var re = /{{([^}}]+)?}}/g,
		code = 'with(obj) { var r=[];\n',
		cursor = 0,
		match;

	while((match = re.exec(html))) {
		code = this._codeAdd(code, html.slice(cursor, match.index));
		code = this._codeAdd(code, match[1], true);
		cursor = match.index + match[0].length;
	}

	code = this._codeAdd(code, html.substr(cursor, html.length - cursor));
	code = (code + 'return r.join(""); }').replace(/[\r\t\n]/g, '');
	

	return code;
};

Core.prototype._codeAdd = function(code, line, js) {
	var reExpCode = /(^( )?(var|case|break|{|}|;))(.*)?/g,
		reExpConditionStart = /(^( )?(if|for|else|switch|{|}|;))(.*)?/g,
		reExpConditionEnd = /(^\/(if|for|else|switch|{|}|;))(.*)?/g,
		reExpCustomStart = /(^( )?(repeat|random|;))(.*)?/g,
		reExpCustomEnd = /(^\/(repeat|random|;))(.*)?/g,
		match;

	if (js) {
		// Check various code starts
		if (line.match(reExpCode)) {
			if (line.substr(0, 5) === 'case ') {
				code += line + ':\n';
			} else {
				code += line + ';\n';
			}
		} else if ((match = reExpConditionStart.exec(line))) {
			// Transform the JS code so it is correct
			// by wrapping it in brackets after the command
			if (match[3] === 'else') {
				if (match[4] === undefined) {
					code += '} ' + match[3] + ' {' + '\n';
				} else {
					code += '} ' + match[3] + ' if (' + match[4] + ') {' + '\n';
				}
			} else {
				code += match[3] + ' (' + match[4] + ') {' + '\n';
			}
		} else if ((match = reExpConditionEnd.exec(line))) {
			code += '}'+ '\n';
		} else if ((match = reExpCustomStart.exec(line))) {
			// Transform the JS code so it is correct
			// by wrapping it in brackets after the command
			code += this.custom[match[3]].start(match);
		} else if ((match = reExpCustomEnd.exec(line))) {
			code += this.custom[match[2]].end(match);
		} else {
			if (line.substr(0, 1) === ':') {
				// Output directly without escaping etc
				line = line.substr(1, line.length -1);
			}

			if (line.substr(0, 1) === '>') {
				// Output with escaping
				// TODO: Escape
				line = line.substr(1, line.length -1);
			}

			code += 'r.push(' + line + ');\n';
		}
	} else {
		if (line !== '') {
			code += 'r.push("' + line.replace(/"/g, '\\"') + '");\n';
		} else {
			code += '';
		}
	}

	return code;
};

Core.prototype.parse = function (html) {
	var code = this.code(html),
		result;

	try {
		result = new Function('obj', code);
	} catch(err) {
		throw("'" + err.message + "'" + " in \n\nCode:\n" + code + "\n");
	}

	return result;
};

Core.prototype.render = function (html, data) {
	var meth = this.parse(html),
		result;

	try {
		result = meth.apply(data, [data]);
	} catch(err) {
		throw(err.message);
	}
	
	result = result.replace(/,]/g, ']');
	result = result.replace(/,}/g, '}');

	return result;
};

Core.prototype.template = function (html) {
	return new Template(this, html);
};

Core.prototype.updateProperty = function (obj, prop, newVal) {
	// Get linked views for this object
	var viewArr = this._linkedViews[obj],
		i;

	if (viewArr && viewArr.length) {
		for (i = 0; i < viewArr.length; i++) {
			viewArr[i].updateProperty(obj, prop, newVal);
		}
	}
};

module.exports = Core;