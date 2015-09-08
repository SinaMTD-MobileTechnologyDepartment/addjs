var banner = [
  '/**',
  '<%=pkg.name%>',
  '@author <%=pkg.author.name%> [<%=pkg.author.email%>]',
  '@fileoverview <%=pkg.description%>',
  '@vserion <%=pkg.version%>',
  '**/',
  ''
].join('\r\n');

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: banner
      },
      files: {
        src: 'addjs.js',
        dest: 'addjs.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', [
    'uglify',
  ]);

};
