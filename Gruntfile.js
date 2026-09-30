module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      gruntfile: {
        src: 'Gruntfile.js'
      },
      specs: {
        src: 'specs/**/*.js',
        options: {
          ignores: ['specs/vendor/**/*.js'],
          laxcomma: true,
          curly: true
        }
      },
      validate: {
        src: '<%= pkg.name %>',
        options: {
          laxcomma: true,
          curly: true
        }
      }
    },
    uglify: {
      options: {
        report: 'gzip',
        banner: '/*!\n' +
                ' * <%= pkg.name %> <%= pkg.version %>\n' +
                ' * http://validatejs.org/\n' +
                ' * (c) 2013-2015 Nicklas Ansman, 2013 Wrapp\n' +
                ' * <%= pkg.name %> may be freely distributed under the MIT license.\n' +
                '*/\n'
      },
      dist: {
        src: "<%= pkg.name %>",
        dest: "validate.min.js",
        options: {
          sourceMap: true,
          sourceMapName: 'validate.min.map'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  function nodeTask(name, args) {
    grunt.registerTask(name, function() {
      var done = this.async();
      grunt.util.spawn({
        cmd: process.execPath,
        args: args,
        opts: {stdio: 'inherit'}
      }, function(error) {
        done(!error);
      });
    });
  }

  nodeTask('specs', [require.resolve('c8/bin/c8.js'), '--include=validate.js',
    '--reporter=text-summary', '--reporter=lcov', 'node', 'scripts/test.cjs']);
  nodeTask('docco', [require.resolve('docco/bin/docco'), 'validate.js']);
  nodeTask('watch', ['scripts/watch.cjs']);

  grunt.registerTask('default', 'watch');
  grunt.registerTask('build', ['test', 'uglify', 'docco']);
  grunt.registerTask('test', ['jshint', 'specs']);
};
