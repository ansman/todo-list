module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'public/javascripts/app.js',
        dest: 'public/javascripts/app.min.js'
      }
    },
    stylus: {
      compile: {
        files: {
          "public/stylesheets/app.css": ["stylus/app.styl"]
        }
      }
    },
    jshint: {
      gruntfile: {
        src: 'Gruntfile.js'
      },
      javascript: {
        src: 'public/javascripts/app.js',
        options: {
          laxcomma: true
        }
      }
    },
    watch: {
      options: { livereload: true },
      stylus: {
        options: { livereload: false },
        files: ['stylus/*.styl'],
        tasks: ['stylus:compile']
      },
      css: {
        files: ['public/**/*.css']
      },
      javascripts: {
        files: ['public/javascripts/**/*.js'],
        tasks: ['jshint']
      },
      html: {
        files: ['public/**/*.html']
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-notify');

  // Default task(s).
  grunt.registerTask('default', ['stylus', 'watch']);
  grunt.registerTask('heroku:production', ['stylus']);
};
