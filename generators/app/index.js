"use strict"

var generators = require('yeoman-generator');
var yosay = require('yosay');

module.exports = generators.Base.extend({
	/**
	 * Wrapper for getting src less|sass, js folders
	 * @param  {[type]} key [description]
	 * @return {[type]}     [description]
	 */
	_computeSrcFolders: function() {
		this.srcFolders = {
			'js': this.srcFolder + "/js",
			'lib': this.srcFolder + "/lib"
		};
		this.srcFolders[this.usePreprocessor] = this.srcFolder + "/" + this.usePreprocessor;
	},
	/**
	 * Wrapper for getting public less|sass, js folders
	 * @param  {[type]} key [description]
	 * @return {[type]}     [description]
	 */
	_computePublicFolders: function() {
		this.publicFolders = {
			'js': this.publicFolder + "/js",
			'css': this.publicFolder + "/css"
		};
	},
	_capitalize: function(string) {
    	return string.charAt(0).toUpperCase() + string.slice(1);
	},
	prompting: {
		getUsername: function() {
			var done = this.async();
		    this.prompt({
		      type    : 'input',
		      name    : 'username',
		      message : 'Would you mind telling me your username?',
		      default : "anonymous"
		    }, function (answers) {
		      this.username = answers.username;
		      done();
		    }.bind(this));
		},
		useFrontendFramework: function() {
			var choices = {
				"Twitter Bootstrap": "bootstrap",
			    "Zurb Foundation": "foundation",
			    "None": false
			};

			this.log(yosay(
        		"Let's generate your app " + this._capitalize(this.username)
      		));

			var done = this.async();
		    this.prompt({
		      type    : 'list',
		      name    : 'useFrontendFramework',
		      message : 'What frontend framework would you like to use?',
		      choices: Object.keys(choices),
		      default : "Twitter Bootstrap",
			  filter: function( val ) { return choices[val]; }
		    }, function (answers) {
		      this.useFrontendFramework = answers.useFrontendFramework;
		      if(this.useFrontendFramework) {
		      	//both Foundation and Bootstrap depend on Jquery
		      	this.useJquery = true;
		      }
		      if(this.useFrontendFramework == "foundation") {
		      	//Foundation does'nt support less for the moment
		      	this.usePreprocessor = "scss";
		      }
		      done();
		    }.bind(this));
		},
		useBuildSystem: function() {
			var choices = {
				"Grunt": "grunt",
			    "Gulp": "gulp"
			};

			var done = this.async();
		    this.prompt({
		      type    : 'list',
		      name    : 'useBuildSystem',
		      message : 'What tool would you like to use for building?',
		      choices: Object.keys(choices),
		      default : "Grunt",
		      filter: function( val ) { return choices[val]; }
		    }, function (answers) {
		    	this.useBuildSystem = answers.useBuildSystem;
		      done();
		    }.bind(this));
		},
		usePreprocessor: function() {
			if(typeof this.usePreprocessor === "undefined")
			{
				var choices = {
					"Less": "less",
				    "Sass": "scss"
				};

				var done = this.async();
			    this.prompt({
			      type    : 'list',
			      name    : 'usePreprocessor',
			      message : 'What Preprocessor would you like to use for styling?',
			      choices: Object.keys(choices),
			      default : "Less",
			      filter: function( val ) { return choices[val]; }
			    }, function (answers) {
			    	this.usePreprocessor = answers.usePreprocessor;
			      done();
			    }.bind(this));
			}
		},
		useJquery: function() {
			if(typeof this.useJquery === "undefined")
			{
				var done = this.async();
			    this.prompt({
			      type    : 'confirm',
			      name    : 'useJquery',
			      message : 'Would you like to use Jquery?',
			      default : true
			    }, function (answers) {
			      if(answers.useJquery) {
			      	this.useJquery = true;
			      } else {
			      	this.useJquery = false;
			      }
			      done();
			    }.bind(this));
			}
		},
		supportIE8: function() {
			var done = this.async();
		    this.prompt({
		      type    : 'confirm',
		      name    : 'supportIE8',
		      message : 'Would you like to support IE(8)? (if yes HTML5 shim and Respond.js will be added for IE8 support of HTML5 elements and media queries)',
		      default : true
		    }, function (answers) {
		      if(answers.supportIE8) {
		      	this.supportIE8 = true;
		      } else {
		      	this.supportIE8 = false;
		      }
		      done();
		    }.bind(this));
		},
		srcFolder: function() {
			var done = this.async();
		    this.prompt({
		      type    : 'input',
		      name    : 'srcFolder',
		      message : 'Where would you like to store assets -js and '+this.usePreprocessor+' files- (examples: assets, src/assets) ?',
		      default : "assets"
		    }, function (answers) {
		      this.srcFolder = answers.srcFolder;
		      this._computeSrcFolders();
		      done();
		    }.bind(this));
		},
		publicFolder: function() {
			var done = this.async();
		    this.prompt({
		      type    : 'input',
		      name    : 'publicFolder',
		      message : 'Where would you like to store public files (release/dist files)?',
		      default : "public"
		    }, function (answers) {
		      this.publicFolder = answers.publicFolder;
		      this._computePublicFolders();
		      done();
		    }.bind(this));
		}
	},
	writing: {
		foldersTree: function() {
			this.log("Writing Hierarchy folders ...");
			this.mkdir(this.srcFolder);
			this.mkdir(this.srcFolders['js']);
			this.mkdir(this.srcFolders[this.usePreprocessor]);
			this.mkdir(this.srcFolders['lib']);
			this.mkdir(this.publicFolder);
			this.mkdir(this.publicFolders['js']);
			this.mkdir(this.publicFolders['css']);
		},
		configFiles: function() {
			//we compile/copy config files
			this.template(
	            this.templatePath('_.bowerrc'),
	            this.destinationPath('.bowerrc')
        	);
        	this.template(
	            this.templatePath('_bower.json'),
	            this.destinationPath('bower.json')
        	);
        	this.template(
	            this.templatePath('_package.json'),
	            this.destinationPath('package.json')
        	);
        	if(this.useBuildSystem == "grunt")
        	{
        		this.template(
		            this.templatePath('_gruntfile.js'),
		            this.destinationPath('gruntfile.js')
	        	);
        	} else {
        		this.template(
		            this.templatePath('_Gulpfile.js'),
		            this.destinationPath('Gulpfile.js')
	        	);
        	}
		},
		projectFiles: function() {
			this.template(
	            this.templatePath('assets/js/_main.js'),
	            this.destinationPath(this.srcFolders['js']+'/main.js')
        	);
        	this.template(
	            this.templatePath('assets/' + this.usePreprocessor + '/_main.' + this.usePreprocessor),
	            this.destinationPath(this.srcFolders[this.usePreprocessor]+'/main.'+this.usePreprocessor)
        	);
			this.template(
	            this.templatePath('public/_index.html'),
	            this.destinationPath(this.publicFolder+'/index.html')
        	);
		}
	},
	install: {
		installDependencies: function() {
			this.log("Installing Dependencies ...");
			//this.log("Switching git config URL mode to https:// instead of git://");
			//this.spawnCommand('git config --global url."https://".insteadOf git://');
			this.installDependencies();
			//this.spawnCommand('git config --global --unset url."https://".insteadOf');
		}
	},
	end: {
		runBuild: function() {
			//this.log("Restoring git config URL mode to git:// instead of https://");
			//this.spawnCommand('git config --global --unset url."https://".insteadOf');
			var myself = this;
			if(this.useBuildSystem == "grunt") {
				this.spawnCommand('grunt')
				.on('exit', function() {
					myself.log(" ******* Happy coding! **********");
				});

			} else {
				this.spawnCommand('gulp');
			}
		},
		generateConfigFile: function() {
			this.config.save();
		}
	}
});