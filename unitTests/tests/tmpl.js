test("Core :: Simple token replacement", function() {
	var tmpl = new Tmpl();

	var result = tmpl.render('{{:name}}, {{:details.age}}', {
		name: 'Test',
		details: {
			age : 12
		}
	});

	strictEqual(result, 'Test, 12', "Name and age tokens replaced by data values");
});

test("Core :: If statement positive", function() {
	var tmpl = new Tmpl();

	var result = tmpl.render('{{if name === "Test"}}{{:name}}{{/if}}, {{:details.age}}', {
		name: 'Test',
		details: {
			age : 12
		}
	});

	strictEqual(result, 'Test, 12', "Name and age tokens replaced by data values");
});

test("Core :: If statement negative", function() {
	var tmpl = new Tmpl();

	var result = tmpl.render('{{if name === "Test2"}}{{:name}}{{/if}}, {{:details.age}}', {
		name: 'Test',
		details: {
			age : 12
		}
	});

	strictEqual(result, ', 12', "Name and age tokens replaced by data values");
});

test("Core :: For statement", function() {
	var tmpl = new Tmpl();

	var result = tmpl.render('{{for key in details}}{{:key}}{{/for}}, {{:details.age}}', {
		name: 'Test',
		details: {
			age : 12
		}
	});

	strictEqual(result, 'age, 12', "Name and age tokens replaced by data values");
});