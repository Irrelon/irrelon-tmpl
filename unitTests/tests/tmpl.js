test("Core :: Simple token replacement", function () {
	var tmpl = new Tmpl();
	
	var result = tmpl.render('{{:name}}, {{:details.age}}', {
		name: 'Test',
		details: {
			age: 12
		}
	});
	
	strictEqual(result, 'Test, 12', "Name and age tokens replaced by data values");
});

test("Core :: If statement positive", function () {
	var tmpl = new Tmpl();
	
	var result = tmpl.render('{{if name === "Test"}}{{:name}}{{/if}}, {{:details.age}}', {
		name: 'Test',
		details: {
			age: 12
		}
	});
	
	strictEqual(result, 'Test, 12', "Name and age tokens replaced by data values");
});

test("Core :: If statement negative", function () {
	var tmpl = new Tmpl();
	
	var result = tmpl.render('{{if name === "Test2"}}{{:name}}{{/if}}, {{:details.age}}', {
		name: 'Test',
		details: {
			age: 12
		}
	});
	
	strictEqual(result, ', 12', "Name and age tokens replaced by data values");
});

test("Core :: For statement against single key in object", function () {
	var tmpl = new Tmpl();
	
	var result = tmpl.render('{{for key in details}}{{:key}}{{/for}}, {{:details.age}}', {
		name: 'Test',
		details: {
			age: 12
		}
	});
	
	strictEqual(result, 'age, 12', "Name and age tokens replaced by data values");
});

test("Core :: For statement against multiple keys in object", function () {
	var tmpl = new Tmpl();
	
	var result = tmpl.render('{{for key in details}}{{:key}}{{/for}}, {{:details.age}}', {
		name: 'Test',
		details: {
			age: 12,
			time: 'four'
		}
	});
	
	strictEqual(result, 'agetime, 12', "Name and age tokens replaced by data values");
});

test("Core :: Repeat statement random in range", function () {
	var tmpl = new Tmpl(),
		globalIndex = 0;
	
	tmpl.custom.repeat = {
		start: function (match) {
			var args = match[4].split(','),
				iteratorVar = '_' + (new Date().getTime() / 1000 | 0).toString(16) + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
					return (Math.random() * 16 | 0).toString(16);
				}).toLowerCase(),
				min,
				max,
				val;
			
			if (args.length === 1) {
				return "for (var " + iteratorVar + " = 0; " + iteratorVar + " < " + args[0] + "; " + iteratorVar + "++) {" + '\n';
			}
			
			if (args.length === 2) {
				min = parseFloat(args[0]);
				max = parseFloat(args[1]);
				val = min + Math.floor(Math.random() * (max - min));
				
				return "for (var " + iteratorVar + " = 0; " + iteratorVar + " < " + val + "; " + iteratorVar + "++) {" + '\n';
			}
			
			return '{' + '\n';
		},
		end: function (match) {
			return "}" + '\n';
		}
	};
	
	var result = tmpl.render(`
	[
		{{repeat 3, 10}}
		{
			"assortmentMongoId": {{:ObjectId()}},
			"bayId": {{:Integer(0, 409)}},
			"productId": {{:Index()}},
			"attributes": {
			{{repeat 5, 40}}
				"{{:Random("Brand", "Make", "Bio", "Fresh", "Fruit", 15)}}": {{:State()}},
			{{/repeat}}
			},
			"forecastSales": {{:Integer(0, 10000)}},
			"forecastVolume": {{:Integer(0, 10000)}},
			"forecastMargin": {{:Integer(0, 10000)}},
			"stockingPoints": {{:Integer(0, 1)}},
			"effectiveWidth": {{:Integer(0, 1)}},
			"effectiveSurfaceArea": 0,
			"effectiveFrontalArea": 0,
			"effectiveVolume": 0
		},
		{{/repeat}}
	]
	`, {
		'Random': function () {
			var index = Math.floor(Math.random() * arguments.length);
			
			return arguments[index];
		},
		'Integer': function (from, to) {
			return from + Math.floor(Math.random() * to);
		},
		'ObjectId': function () {
			return '"' + (new Date().getTime() / 1000 | 0).toString(16) + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
				return (Math.random() * 16 | 0).toString(16);
			}).toLowerCase() + '"';
		},
		'Index': function () {
			return ++globalIndex;
		},
		'State': function () {
			return '"Moo"';
		}
	});
	
	strictEqual(result, 'agetime, 12', "Name and age tokens replaced by data values");
});

test("Core :: Variables declared and accessed", function () {
	var tmpl = new Tmpl();
	
	var result = tmpl.render('{{var test = "moo"}}, {{:test}}', {
		name: 'Test',
		details: {
			age: 12,
			time: 'four'
		}
	});
	
	strictEqual(result, ', moo', "Variable assigned and correctly returned");
});

test("Core :: Switch statement", function () {
	var tmpl = new Tmpl();
	
	var result = tmpl.render('{{var test = "moo"}}{{switch test}}{{case "foo"}}foo was there{{break}}{{case "moo"}}moo was there{{break}}{{/switch}}', {
		name: 'Test',
		details: {
			age: 12,
			time: 'four'
		}
	});
	
	strictEqual(result, 'moo was there', "Switch output the correct text");
});


test("Core :: If with else statement", function () {
	var tmpl = new Tmpl();
	
	var result = tmpl.render('{{var test = "moo"}}{{if test === "foo"}}foo was there{{else}}something else was there{{/if}}', {
		name: 'Test',
		details: {
			age: 12,
			time: 'four'
		}
	});
	
	strictEqual(result, 'something else was there', "Output the correct text");
});

test("Core :: If with else if statement", function () {
	var tmpl = new Tmpl();
	
	var result = tmpl.render('{{var test = "moo"}}{{if test === "foo"}}foo was there{{else test === "moo"}}moo was there{{/if}}', {
		name: 'Test',
		details: {
			age: 12,
			time: 'four'
		}
	});
	
	strictEqual(result, 'moo was there', "Output the correct text");
});

test("Core :: Test creating template instance", function () {
	var tmpl = new Tmpl(),
		tmplInstance = tmpl.template('{{var test = "moo"}}{{if test === "foo"}}foo was there{{else test === "moo"}}moo was there{{/if}}');
	
	var result = tmplInstance.render({
		name: 'Test',
		details: {
			age: 12,
			time: 'four'
		}
	});
	
	strictEqual(result, 'moo was there', "Output the correct text");
});

test("Core :: Data-binding", function () {
	var tmpl = new Tmpl(),
		tmplInstance = tmpl.template('{^{:name}}'),
		data = {
			name: 'Test',
			details: {
				age: 12,
				time: 'four'
			}
		};
	
	var result = tmplInstance.link(data);
	
	strictEqual(result, 'Test', "Output the correct text before data update");
	
	tmpl.updateProperty(data, 'name', 'Test2');
	
	strictEqual(result, 'Test', "Output the correct text after data update");
});