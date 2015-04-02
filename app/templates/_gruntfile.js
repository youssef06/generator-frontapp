module.exports = function(grunt) {

  <% var preprocessor_task = usePreprocessor == "less"?"less":"sass" %>
  // Project configuration.
  grunt.initConfig({
    // Metadata.
    config: {
      commonLib: '<%= srcFolders["lib"] %>',
      jsLib: '<%= srcFolders["js"] %>/lib',
      styleLib: '<%= srcFolders[this.usePreprocessor] %>/lib',
      tmpDist: '<%= srcFolder %>/dist',
      dist: '<%= publicFolder %>'
    },
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%%= pkg.title || pkg.name %> - v<%%= pkg.version %> - ' +
        '<%%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%%= grunt.template.today("yyyy") %> <%%= pkg.author.name %>;' +
        ' Licensed <%%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    <% if(usePreprocessor == "less") { %>
    less: {
      frontend : {
        options: {
          cleancss: false,
          compress: false
        },
        files: [{
            expand: true,
            cwd: '<%= srcFolders[usePreprocessor] %>',
            src: ['**/*.less'],
            dest: '<%%= config.tmpDist %>/css/',
            ext: '.css'
        }]
      }
    },
    <% } else { %>
    sass: {
      frontend: {
        files: [{
          expand: true,
          cwd: '<%= srcFolders[usePreprocessor] %>',
          src: ['**/*.scss'],
          dest: '<%%= config.tmpDist %>/css/',
          ext: '.css'
        }]
      }
    },
    <% } %>
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      frontend: {
        files: 
        [{
          expand: true,
          cwd: '<%%= config.tmpDist %>/css',
          src: ['*.css', '!*.min.css'],
          dest: '<%%= config.dist %>/css/',
          ext: '.min.css'
        }]
      }
    },
    concat: {
      options: {
        banner: '<%%= banner %>',
        stripBanners: true
      },
      frontend: {
        src: [
          <% if(usePreprocessor == "bootstrap") { %>'<%%= config.commonLib %>/bootstrap/dist/js/bootstrap.js',<% } %>
          <% if(usePreprocessor == "foundation") { %>'<%%= config.commonLib %>/foundation/js/foundation.js',<% } %>
          '<%= srcFolders["js"] %>/main.js'
        ],
        dest: '<%%= config.tmpDist %>/js/app.js'
      }
    },
    uglify: {
      options: {
        banner: '<%%= banner %>'
      },
      frontend: {
        src: '<%%= config.tmpDist %>/js/app.js',
        dest: '<%%= config.dist %>/js/app.min.js'
      }
    },
    watch: {
      styles: {
        files: ['<%= srcFolders[usePreprocessor] %>/**/*.<%= usePreprocessor %>'],
        tasks: ['<%= preprocessor_task %>:frontend', 'cssmin:frontend'],
        options: {
          spawn: false
        }
      },
      scripts: {
        files: ['<%= srcFolders["js"] %>/**/*.js'],
        tasks: ['concat','uglify'],
        options: {
          spawn: false
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 9001,
          hostname: 'localhost',
          base: '<%%= config.dist %>',
          keepalive: true
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  <% if(usePreprocessor == "less") { %>
  grunt.loadNpmTasks('grunt-contrib-less');
  <% } else { %>
  grunt.loadNpmTasks('grunt-contrib-sass');
  <% } %>
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task.
  grunt.registerTask('default', ['<%= preprocessor_task %>', 'cssmin', 'concat', 'uglify', 'connect']);
  grunt.registerTask('css', ['<%= preprocessor_task %>', 'cssmin']);
};