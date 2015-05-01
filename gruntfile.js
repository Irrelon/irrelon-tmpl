module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks("grunt-browserify");
	grunt.loadNpmTasks('grunt-qunit-blanket-lcov');
	grunt.loadNpmTasks('grunt-umd');

	grunt.initConfig({
		"jshint": {
			"options": {
				evil: true
			},
			"irrelon-tmpl": {
				"files": {
					"src": [
						"js/lib/*.js"
					]
				}
			}
		},

		qunit: {
			"irrelon-tmpl": {
				"src": [
					"unitTests/index.html"
				]
			}
		},

		"qunit_blanket_lcov": {
			"lib": {
				"src": "js/unitTests/lib/fdb-all.js",
				"options": {
					"dest": "coverage/fdb-all.lcov",
					force: true
				}
			}
		},

		"browserify": {
			"all": {
				src: ["./js/builds/all.js"],
				dest: "./js/dist/tmpl.js",
				options: {
					verbose: true,
					debug: true,
					plugin: [
						["browserify-derequire"]
					]
				}
			}
		}
	});

	grunt.registerTask("1: Check & Build Source File", ["2: Check Code Cleanliness", "3: Build Source File"]);
	grunt.registerTask("2: Check Code Cleanliness", ["jshint"]);
	grunt.registerTask("3: Build Source File", ["browserify"]);
	grunt.registerTask("4: Minify Distribution Source", ["uglify"]);
	grunt.registerTask("5: Run Unit Tests", ["qunit"]);
	grunt.registerTask("6: Full Build Cycle", ["jshint", "browserify", "postfix", "uglify", "copy", "qunit"]);
	grunt.registerTask("7: Full Build Cycle + Version", ["version", "jshint", "browserify", "postfix", "uglify", "copy", "qunit"]);
};