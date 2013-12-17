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
        tasks: ["requirejs:development", "jshint:src"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-stylus");
  grunt.loadNpmTasks("grunt-contrib-requirejs");
  grunt.loadNpmTasks("grunt-notify");

  grunt.registerTask("default", "watch");
  grunt.registerTask("heroku:production", ["stylus"]);
};
