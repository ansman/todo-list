module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    stylus: {
      compile: {
        files: {
          "public/stylesheets/app.css": ["src/stylus/app.styl"]
        }
      }
    },
    jshint: {
      gruntfile: {
        src: "Gruntfile.js",
        options: {
          laxcomma: true
        }
      },
      specs: {
        src: "specs/**/*.js",
        options: {
          ignores: ["specs/vendor/**/*.js"],
          laxcomma: true
        }
      },
      src: {
        src: "src/javascripts/**/*.js",
        options: {
          laxcomma: true,
          ignores: [
            "src/javascripts/text.js",
          ]
        }
      }
    },
    jasmine: {
      specs: {
        src: "src/javascripts/**/*.js",
        options: {
          keepRunner: true,
          outfile: 'tests.html',
          specs: "specs/**/*-spec.js",
          template: require('grunt-template-jasmine-requirejs'),
          templateOptions: {
            requireConfig: {
              paths: {
                jquery: "specs/vendor/jquery.min",
                underscore: "specs/vendor/underscore-min",
                backbone: "specs/vendor/backbone-min"
              },
              shim: {
                underscore: {
                  exports: "_"
                },
                backbone: {
                  exports: "Backbone",
                  deps: ["jquery", "underscore"]
                }
              }
            }
          }
        }
      }
    },
    requirejs: {
      development: {
        options: {
          useStrict: true,
          optimize: '',
          baseUrl: 'src/javascripts',
          out: 'public/javascripts/app.js',
          name: 'app',
          mainConfigFile: './src/config/development.js',
          stubModules: ["text"]
        }
      }
    },
    watch: {
      gruntfile: {
        files: ["Gruntfile.js"],
        tasks: ["jshint:gruntfile"]
      },
      stylus: {
        options: { atBegin: true },
        files: ["src/stylus/*.styl"],
        tasks: ["stylus:compile"]
      },
      livereload: {
        files: ["public/**/*.css", "public/**/*.js", "public/**/*.html"],
        options: { livereload: true },
      },
      src: {
        options: { atBegin: true, },
        files: ["src/javascripts/**/*.js"],
        tasks: ["requirejs:development", "jshint:src", "jasmine"]
      },
      specs: {
        options: { atBegin: true, },
        files: ["specs/**/*.js"],
        tasks: ["jshint:specs", "jasmine"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-jasmine");
  grunt.loadNpmTasks("grunt-contrib-stylus");
  grunt.loadNpmTasks("grunt-contrib-requirejs");
  grunt.loadNpmTasks("grunt-notify");

  grunt.registerTask("default", "watch");
  grunt.registerTask("heroku:production", ["stylus"]);
};
