var Core = require('../lib/Core');

if (typeof window !== 'undefined') {
	window.Tmpl = Core;
}

module.exports = Core;