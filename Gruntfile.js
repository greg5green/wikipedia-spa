'use strict';

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    clean: ['dist/*'],
    compass: {
      dist: {
        options: {
          sassDir: 'app/sass',
          cssDir: 'dist/stylesheets',
          noLineComments: true,
          outputStyle: 'compressed'
        }
      }
    },
    connect: {
      options: {
        hostname: 'localhost',
        open: false
      },
      dist: {
        options: {
          base: 'dist',
          port: 9000,
          livereload: false
        }
      }
    },
    copy: {
      dist: {
        files: [
          {
            cwd: 'app',
            dest: 'dist',
            expand: true,
            src: ['{,*/}*.html']
          },
          {
            cwd: 'app/bower_components/jquery/dist',
            dest: 'dist/javascripts/vendor',
            expand: true,
            src: ['jquery.min.js', 'jquery.min.map']
          },
          {
            cwd: 'app/bower_components/handlebars',
            dest: 'dist/javascripts/vendor',
            expand: true,
            src: ['handlebars.min.js']
          },
          {
            cwd: 'app/javascripts',
            dest: 'dist/javascripts',
            expand: true,
            src: ['main.js']
          }
        ]
      }
    },
    'gh-pages': {
      options: {
        base: 'dist'
      },
      src: '**/*'
    },
    uncss: {
      dist: {
        files: {
          'dist/stylesheets/styles.css': ['app/index.html']
        },
        options : {
          ignore: ['.summary', '.well']
        }
      }
    },
    watch: {
      compass: {
        files: ['app/sass/{,*/}*.{scss,sass}'],
        tasks: ['compass:dist'],
        options: {
          spawn: false,
          livereload: false
        }
      },
      copy: {
        files: ['app/{,*/}*.html', 'app/javascripts/{,*/}*.js'],
        tasks: ['copy:dist'],
        options: {
          spawn: false,
          livereload: false
        }
      },
      gruntfile: {
        files: ['Gruntfile.js']
      }
    }
  });

  grunt.registerTask('build', ['clean', 'compass:dist', 'copy:dist']);
  grunt.registerTask('serve', ['compass:dist', 'copy:dist', 'connect', 'watch']);

};
