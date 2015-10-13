module.exports = function(grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          "frontend/web/css/bootstrap.css": "frontend/web/less/bootstrap/bootstrap.less", // destination file and source file
          "frontend/web/css/desktop/landing.css": "frontend/web/less/desktop/landing.less",
          "frontend/web/css/desktop/topic.css": "frontend/web/less/desktop/topic.less",
          "frontend/web/css/desktop/meet.css": "frontend/web/less/desktop/meet.less",
          "frontend/web/css/mobile/landing.css": "frontend/web/less/mobile/landing.less",
          "frontend/web/css/mobile/topic.css": "frontend/web/less/mobile/topic.less",
          "frontend/web/css/mobile/meet.css": "frontend/web/less/mobile/meet.less",
          "frontend/web/css/mobile/setting.css": "frontend/web/less/mobile/setting.less",
          "frontend/web/css/mobile/post.css": "frontend/web/less/mobile/post.less",
          "frontend/web/css/desktop/post.css": "frontend/web/less/desktop/post.less",
        }
      }
    },
    watch: {
      styles: {
        files: ['frontend/web/less/**/*.less', 'backend/web/less/**/*.less'], // which files to watch
        tasks: ['less'],
        options: {
          nospawn: true
        }
      }
    }
  });

  grunt.registerTask('default', ['less', 'watch']);
};
