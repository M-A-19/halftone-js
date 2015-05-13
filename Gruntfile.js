module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
  });

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/jquery.<%= pkg.name %>.js',
        dest: 'build/jquery.<%= pkg.name %>.min.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
    // Load the plugin that provides the "qunit" task.
  grunt.loadNpmTasks('grunt-contrib-qunit');
  
  //qunit-specific configuration

grunt.config('qunit', {
	  files: ['test/**/*.html']
});

  // Default task(s).
  grunt.registerTask('default', ['qunit','uglify']);
  
};
