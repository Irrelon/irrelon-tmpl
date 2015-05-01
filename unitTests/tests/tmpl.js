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

test("Core :: For statement against single key in object", function() {
	var tmpl = new Tmpl();

	var result = tmpl.render('{{for key in details}}{{:key}}{{/for}}, {{:details.age}}', {
		name: 'Test',
		details: {
			age : 12
		}
	});

	strictEqual(result, 'age, 12', "Name and age tokens replaced by data values");
});

test("Core :: For statement against multiple keys in object", function() {
	var tmpl = new Tmpl();

	var result = tmpl.render('{{for key in details}}{{:key}}{{/for}}, {{:details.age}}', {
		name: 'Test',
		details: {
			age : 12,
			time: 'four'
		}
	});

	strictEqual(result, 'agetime, 12', "Name and age tokens replaced by data values");
});

test("Core :: Variables declared and accessed", function() {
	var tmpl = new Tmpl();

	var result = tmpl.render('{{var test = "moo"}}, {{:test}}', {
		name: 'Test',
		details: {
			age : 12,
			time: 'four'
		}
	});

	strictEqual(result, ', moo', "Variable assigned and correctly returned");
});

test("Core :: Switch statement", function() {
	var tmpl = new Tmpl();

	var result = tmpl.render('{{var test = "moo"}}{{switch test}}{{case "foo"}}foo was there{{break}}{{case "moo"}}moo was there{{break}}{{/switch}}', {
		name: 'Test',
		details: {
			age : 12,
			time: 'four'
		}
	});

	strictEqual(result, 'moo was there', "Switch output the correct text");
});


test("Core :: If with else statement", function() {
	var tmpl = new Tmpl();

	var result = tmpl.render('{{var test = "moo"}}{{if test === "foo"}}foo was there{{else}}something else was there{{/if}}', {
		name: 'Test',
		details: {
			age : 12,
			time: 'four'
		}
	});

	strictEqual(result, 'something else was there', "Output the correct text");
});

test("Core :: If with else if statement", function() {
	var tmpl = new Tmpl();

	var result = tmpl.render('{{var test = "moo"}}{{if test === "foo"}}foo was there{{else test === "moo"}}moo was there{{/if}}', {
		name: 'Test',
		details: {
			age : 12,
			time: 'four'
		}
	});

	strictEqual(result, 'moo was there', "Output the correct text");
});